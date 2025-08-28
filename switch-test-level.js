#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TEST_LEVELS = {
  'basic': 'TEST_LEVELS.BASIC',
  'storage': 'TEST_LEVELS.ASYNC_STORAGE', 
  'navigation': 'TEST_LEVELS.NAVIGATION',
  'full': 'TEST_LEVELS.FULL'
};

const level = process.argv[2];

if (!level || !TEST_LEVELS[level]) {
  console.log('Usage: node switch-test-level.js <level>');
  console.log('Available levels:');
  Object.keys(TEST_LEVELS).forEach(key => {
