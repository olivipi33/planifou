import dotenv from 'dotenv';
import { file, search } from './planitou/api-planitou';
import { existsSync, mkdirSync } from 'fs';

import { getAPIToken, loginPlanitou } from "./planitou/auth";
import { saveBlobToFile } from './utils/utils';

dotenv.config();

const createDirIfNotExists = (dir: string) =>
  !existsSync(dir) ? mkdirSync(dir) : undefined;

const main = async () => {
  const destinationFolder = 'downloads';
  createDirIfNotExists(destinationFolder);

  const username = process.env.PLANITOU_USERNAME;
  const password = process.env.PLANITOU_PASSWORD;

  if (!username || !password) {
    console.error('Passord or username is missing.');
    process.exit(1);
  }

  const login = await loginPlanitou(username, password);
  if (login.status === 'error') {
    console.error('Fail to login.');
    process.exit(1);
  }

  const apiToken = await getAPIToken(login.data.token);
  if (!apiToken) return;
  console.log(apiToken);

  const currentDate = new Date();
  const fiveDaysAgo = new Date(new Date().setDate(new Date().getDate() - 5));

  const agenda = await search(apiToken, 262, fiveDaysAgo.toString(), currentDate.toString());
  agenda.data.forEach((entry) => {
    entry.files.forEach(async (planitouFile) => {
      const photo = await file(apiToken, Number(planitouFile.id));
      const fileName = `${destinationFolder}/${planitouFile.filename}`;
      if (photo && existsSync(fileName)) saveBlobToFile(photo, fileName);
    })
  })
}

main();