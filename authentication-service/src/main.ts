import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  await app.listen(process.env.PORT);
}
bootstrap();

// inside dist folder
const logDir = path.join(__dirname, 'logs');
const logFilePath = path.join(logDir, 'terminal_logs.txt');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logFile = fs.createWriteStream(logFilePath); // for Open in append mode add : , { flags: 'a' }
// Override console.log to write to the log file
const originalConsoleLog = console.log;
console.log = (...args) => {
  const message = args.join(' ') + '\n';
  // logFile.write(message); // Write to the log file
  originalConsoleLog(...args); // Keep the original console.log behavior for display in terminal
};

// Override console.error to write to the log file
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.join(' ') + '\n';
  // logFile.write(message); // Write to the log file
  originalConsoleError(...args); // Keep the original console.error behavior for display in terminal
};

// stdout to catch all NORMAL logs in the terminal
const originalStdoutWrite = process.stdout.write.bind(process.stdout);
process.stdout.write = (chunk: Uint8Array, ...args) => {
  chunk
    .toString()
    .split(/\r?\n/g)
    .filter(Boolean) // Filter out empty strings
    .forEach((line) => {
      // logFile.write(line + '\n');
    });
  return originalStdoutWrite(chunk, ...args); // Original stdout behavior
};
// stderr to catch all ERROR logs in the terminal
const originalStderrWrite = process.stderr.write.bind(process.stderr);
process.stderr.write = (chunk: Uint8Array, ...args) => {
  chunk
    .toString()
    .split(/\r?\n/g)
    .filter(Boolean) // Filter out empty strings
    .forEach((line) => {
      // logFile.write(line + '\n');
    });
  return originalStderrWrite(chunk, ...args); // Original stderr behavior
};