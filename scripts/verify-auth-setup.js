/**
 * Authentication Setup Verification Script
 * Run this to verify all auth files are properly configured
 * 
 * Usage: node scripts/verify-auth-setup.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}\n`),
};

// File checks
const requiredFiles = [
  'redux/store.ts',
  'redux/slices/authSlice.ts',
  'services/authService.ts',
  'utils/axiosInterceptor.ts',
  'constants/Api.ts',
  'app/_layout.tsx',
  'app/(auth)/phone-login.tsx',
];

const documentationFiles = [
  'AUTHENTICATION_SYSTEM.md',
  'AUTH_QUICK_REFERENCE.md',
  'AUTH_FLOW_DIAGRAMS.md',
  'README_AUTHENTICATION.md',
  'AUTH_TESTING_CHECKLIST.md',
  'AUTH_IMPLEMENTATION_SUMMARY.md',
];

// Configuration checks
const configChecks = [
  {
    file: 'redux/store.ts',
    checks: [
      { pattern: /whitelist:\s*\['auth'\]/, message: 'Auth in persist whitelist' },
      { pattern: /redux-persist/, message: 'Redux persist imported' },
      { pattern: /persistStore/, message: 'Persistor created' },
    ],
  },
  {
    file: 'utils/axiosInterceptor.ts',
    checks: [
      { pattern: /setupAxiosInterceptors/, message: 'Setup function exported' },
      { pattern: /isRefreshing/, message: 'Refresh flag implemented' },
      { pattern: /failedQueue/, message: 'Request queue implemented' },
      { pattern: /auth\/refresh-token/, message: 'Refresh endpoint check' },
      { pattern: /store\.dispatch\(logout\(\)\)/, message: 'Logout on refresh failure' },
      { pattern: /store\.dispatch\(setToken/, message: 'Redux state sync on refresh' },
    ],
  },
  {
    file: 'app/_layout.tsx',
    checks: [
      { pattern: /setupAxiosInterceptors/, message: 'Interceptors setup called' },
      { pattern: /loadAuthFromStorage/, message: 'Auth loading on startup' },
      { pattern: /<PersistGate.*loading/, message: 'PersistGate has loading prop' },
    ],
  },
  {
    file: 'redux/slices/authSlice.ts',
    checks: [
      { pattern: /loadAuthFromStorage/, message: 'loadAuthFromStorage action' },
      { pattern: /sendOtpAsync/, message: 'sendOtpAsync action' },
      { pattern: /verifyOtpAsync/, message: 'verifyOtpAsync action' },
      { pattern: /logout/, message: 'logout action' },
      { pattern: /AsyncStorage\.multiRemove/, message: 'Storage cleanup on logout' },
    ],
  },
  {
    file: 'services/authService.ts',
    checks: [
      { pattern: /refreshAccessToken/, message: 'refreshAccessToken function' },
      { pattern: /normalizePhoneNumber/, message: 'Phone normalization' },
      { pattern: /validatePhoneNumber/, message: 'Phone validation' },
    ],
  },
];

function checkFileExists(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  return fs.existsSync(fullPath);
}

function checkFileContent(filePath, pattern) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    return pattern.test(content);
  } catch (error) {
    return false;
  }
}

function verifyFiles() {
  log.section('📁 Verifying Required Files');
  
  let allFilesExist = true;
  
  requiredFiles.forEach((file) => {
    if (checkFileExists(file)) {
      log.success(`${file}`);
    } else {
      log.error(`${file} - NOT FOUND`);
      allFilesExist = false;
    }
  });
  
  return allFilesExist;
}

function verifyDocumentation() {
  log.section('📚 Verifying Documentation Files');
  
  let allDocsExist = true;
  
  documentationFiles.forEach((file) => {
    if (checkFileExists(file)) {
      log.success(`${file}`);
    } else {
      log.warning(`${file} - NOT FOUND (optional)`);
      allDocsExist = false;
    }
  });
  
  return allDocsExist;
}

function verifyConfiguration() {
  log.section('⚙️  Verifying Configuration');
  
  let allChecksPass = true;
  
  configChecks.forEach(({ file, checks }) => {
    log.info(`Checking ${file}:`);
    
    checks.forEach(({ pattern, message }) => {
      if (checkFileContent(file, pattern)) {
        log.success(`  ${message}`);
      } else {
        log.error(`  ${message} - NOT FOUND`);
        allChecksPass = false;
      }
    });
    
    console.log('');
  });
  
  return allChecksPass;
}

function verifyPackages() {
  log.section('📦 Verifying Required Packages');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    log.error('package.json not found');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredPackages = [
    '@reduxjs/toolkit',
    'redux-persist',
    '@react-native-async-storage/async-storage',
    'axios',
    'react-redux',
  ];
  
  let allPackagesInstalled = true;
  
  requiredPackages.forEach((pkg) => {
    if (dependencies[pkg]) {
      log.success(`${pkg} (${dependencies[pkg]})`);
    } else {
      log.error(`${pkg} - NOT INSTALLED`);
      allPackagesInstalled = false;
    }
  });
  
  return allPackagesInstalled;
}

function printSummary(filesOk, docsOk, configOk, packagesOk) {
  log.section('📊 Verification Summary');
  
  console.log(`Required Files:    ${filesOk ? colors.green + '✅ PASS' : colors.red + '❌ FAIL'}${colors.reset}`);
  console.log(`Documentation:     ${docsOk ? colors.green + '✅ PASS' : colors.yellow + '⚠️  INCOMPLETE'}${colors.reset}`);
  console.log(`Configuration:     ${configOk ? colors.green + '✅ PASS' : colors.red + '❌ FAIL'}${colors.reset}`);
  console.log(`Packages:          ${packagesOk ? colors.green + '✅ PASS' : colors.red + '❌ FAIL'}${colors.reset}`);
  
  console.log('');
  
  if (filesOk && configOk && packagesOk) {
    log.success('🎉 Authentication system is properly configured!');
    console.log('');
    log.info('Next steps:');
    console.log('  1. Run the app and test login flow');
    console.log('  2. Check AUTH_TESTING_CHECKLIST.md for test scenarios');
    console.log('  3. Use AuthDebugPanel component for debugging');
    console.log('');
  } else {
    log.error('⚠️  Some checks failed. Please review the errors above.');
    console.log('');
    log.info('Refer to AUTHENTICATION_SYSTEM.md for setup instructions.');
    console.log('');
  }
}

// Run verification
console.log(`${colors.cyan}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     🔐 Authentication System Verification Script         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);

const filesOk = verifyFiles();
const docsOk = verifyDocumentation();
const configOk = verifyConfiguration();
const packagesOk = verifyPackages();

printSummary(filesOk, docsOk, configOk, packagesOk);

// Exit with appropriate code
process.exit(filesOk && configOk && packagesOk ? 0 : 1);
