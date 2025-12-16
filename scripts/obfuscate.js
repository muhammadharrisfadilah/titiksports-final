const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// Configuration for obfuscation
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: false, // Set true for extra protection
  debugProtectionInterval: 0,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['rc4'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false
};

// Directories to obfuscate
const BUILD_DIR = path.join(__dirname, '../.next');
const STATIC_DIR = path.join(BUILD_DIR, 'static');

function obfuscateFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const obfuscationResult = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
    fs.writeFileSync(filePath, obfuscationResult.getObfuscatedCode());
    console.log(`✅ Obfuscated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error obfuscating ${filePath}:`, error.message);
  }
}

function obfuscateDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir, { withFileTypes: true });

  files.forEach(file => {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      obfuscateDirectory(filePath);
    } else if (file.isFile() && file.name.endsWith('.js')) {
      // Skip some system files
      if (file.name.includes('webpack') || file.name.includes('polyfill')) {
        console.log(`⏭️  Skipped: ${filePath}`);
        return;
      }
      
      obfuscateFile(filePath);
    }
  });
}

console.log('🔒 Starting code obfuscation...\n');

// Obfuscate static JS files
if (fs.existsSync(STATIC_DIR)) {
  const chunksDir = path.join(STATIC_DIR, 'chunks');
  if (fs.existsSync(chunksDir)) {
    console.log('📁 Obfuscating chunks directory...');
    obfuscateDirectory(chunksDir);
  }
}

console.log('\n✅ Obfuscation complete!');
console.log('⚠️  Note: Test your build thoroughly before deployment.');