import { createWriteStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ToyCar/glTF-Binary/ToyCar.glb';
const destination = resolve('public/models/toy-car.glb');

await mkdir(dirname(destination), { recursive: true });

const response = await fetch(url, {
  headers: { 'User-Agent': 'luxury-car-phase1-setup' },
  redirect: 'follow',
});

if (!response.ok || !response.body) {
  throw new Error(`Could not download ToyCar.glb: ${response.status} ${response.statusText}`);
}

await pipeline(Readable.fromWeb(response.body), createWriteStream(destination));
const info = await stat(destination);
console.log(`Downloaded ToyCar.glb (${(info.size / 1024 / 1024).toFixed(2)} MB).`);
