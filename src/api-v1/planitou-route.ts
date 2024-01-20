import { Request, Response } from 'express';
import { Router } from 'express';
import Jimp from 'jimp';
import { file, options, search } from '../planitou';

export const planitou: Router = Router();

export interface SearchRequest extends Request {
  kid?: number,
  startDate?: string,
  endDate?: string
}

planitou.get('/kids', async (req: Request, res: Response) => {
  try {
    const token = req.session.token;
    if (!token) {
      return res.status(401).send({ status: 'error', message: 'missing token', code: 401 });
    }
    const option = await options(token);
    if (!option) return res.status(404).send({ status: 'error', message: 'option not found', code: 404 });

    let result: number[] = [];
    option.data.children.forEach((kid) => {
      result.push(Number(kid.id));
    })
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

planitou.post('/search', async (req: SearchRequest, res: Response) => {
  try {
    const { kid, startDate, endDate } = req.body;

    if (!kid || !startDate || !endDate) {
      return res.status(404).send({ status: 'error', message: 'parameter missing', code: 404 });
    }

    if (isNaN(Number(kid))) {
      return res.status(404).send({ status: 'error', message: 'kid id is missing', code: 404 });
    }

    if (isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
      return res.status(404).send({ status: 'error', message: 'date is invalid', code: 404 });
    }

    const token = req.session.token;
    if (!token) {
      return res.status(401).send({ status: 'error', message: 'missing token', code: 401 });
    }

    const agenda = await search(token, kid, startDate, endDate);
    let imgesId: number[] = [];
    agenda.data.forEach((entry) => {
      entry.files.forEach(async (planitouFile) => {
        const id = Number(planitouFile.id);
        if (!isNaN(id)) imgesId.push(id);
      })
    });
    const setId = new Set(imgesId);
    let imageBuffers: Buffer[] = [];
    const batchSize = 10;
    let batchCount = 0;

    let i = 0;
    for (const fileId of setId) {
      const blob = await file(token, fileId);
      if (blob) {
        console.log(`${(i / setId.size * 100).toFixed(2)}% - ID: ${fileId}`);
        const buffer = await new Response(blob).arrayBuffer();
        const image = await Jimp.read(Buffer.from(buffer));
        const processedImageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
        imageBuffers.push(processedImageBuffer);

        if (batchCount === batchSize) {
          res.write(JSON.stringify({ images: imageBuffers }));
          imageBuffers = [];
          batchCount = 0;
        }

        imageBuffers.push(processedImageBuffer);
        batchCount++;
      }
      i++;
    }

    if (imageBuffers.length > 0) {
      res.write(JSON.stringify({ images: imageBuffers }));
    }

    res.end();

  } catch (error: any) {
    res.status(500).send({ message: `Internal server error: ${error}`, status: 500 });
  }
});

