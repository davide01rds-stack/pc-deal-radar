import test from 'node:test';import assert from 'node:assert/strict';import {REQUIRED,SHOPS,parseShop,parseCommand,evaluate} from '../src/logic.js';
test('hard budget and VRAM',()=>{assert.equal(REQUIRED.max,1400);assert.equal(REQUIRED.minVram,12);});
test('EU and Italian stores included',()=>{for(const x of ['amazon.de','amazon.es','minimalgamers.it','breunor.com','bpscomputer.it'])assert.ok(SHOPS.includes(x));});
test('reject hostile links',()=>{for(const x of ['http://amazon.it','https://amazon.it.evil.com/','https://bad.com','https://user:pass@amazon.de'])assert.equal(parseShop(x),null);assert.equal(parseShop('https://www.amazon.de/dp/123')?.host,'amazon.de');});
test('Telegram commands',()=>{assert.equal(parseCommand('/aggiungi https://amazon.de/x').cmd,'add');assert.equal(parseCommand('/offerte@MyBot').cmd,'offerte');});
test('no score for unknown evidence',()=>{let p={prebuilt:true,new:true,price:1000,shipping:0,fees:0,gpuVendor:'NVIDIA',cuda:true,vram:12};assert.equal(evaluate(p).status,'review');});
test('hard filters',()=>{let p={prebuilt:true,new:true,price:1399,shipping:2,fees:0,gpuVendor:'NVIDIA',cuda:true,vram:12};assert.equal(evaluate(p).status,'rejected');assert.equal(evaluate({...p,price:1000,vram:8}).status,'rejected');});
