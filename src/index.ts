import dotenv from 'dotenv';
import { file, search } from './planitou/api-planitou';

import { getAPIToken, loginPlanitou } from "./planitou/auth";
import { saveBlobToFile } from './utils/utils';

dotenv.config();

const main = async () => {
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

  const agenda = await search(apiToken, 262, "2023-11-26", "2024-01-07");
  console.log(agenda);
  agenda.data.forEach((entry) => {
    entry.files.forEach(async (planitouFile) => {
      const photo = await file(apiToken, Number(planitouFile.id));
      if (photo) saveBlobToFile(photo, `downloads/${planitouFile.filename}`);
    })
  })
}

main();