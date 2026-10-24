import test from 'node:test';
import assert from 'node:assert/strict';
import {connectTelegram} from '../src/connect.js';
const url='https://pc-deal-radar.demo.workers.dev/connect';
const env={
  TELEGRAM_BOT_TOKEN:'123:TEST_ONLY',
  TELEGRAM_CHAT_ID:'12345',
  TELEGRAM_WEBHOOK_SECRET:'abcdef0123456789_XY',
  DB:{prepare:()=>({first:async()=>({name:'offers'})})}
};
test('GET displays a form without leaking credentials',async()=>{const response=await connectTelegram(new Request(url),env);assert.equal(response.status,200);assert.match(await response.text(),/method="POST"/);});
test('incomplete configuration fails closed',async()=>{const response=await connectTelegram(new Request(url,{method:'POST'}),{});assert.equal(response.status,503);});
test('cross-origin POST is denied',async()=>{const response=await connectTelegram(new Request(url,{method:'POST',headers:{origin:'https://attacker.example'}}),env);assert.equal(response.status,403);});
test('wrong host fails closed',async()=>{const response=await connectTelegram(new Request('https://example.com/connect',{method:'POST'}),env);assert.equal(response.status,400);});
test('uninitialized database blocks activation',async()=>{const response=await connectTelegram(new Request(url,{method:'POST'}),{...env,DB:{prepare:()=>({first:async()=>null})}});assert.equal(response.status,503);});
test('registers correct webhook without exposing token to browser',async()=>{let called;const response=await connectTelegram(new Request(url,{method:'POST'}),env,async(remote,options)=>{called={remote,options};return {ok:true,json:async()=>({ok:true,result:true})};});assert.equal(response.status,200);const body=JSON.parse(called.options.body);assert.equal(body.url,'https://pc-deal-radar.demo.workers.dev/telegram');assert.equal(body.secret_token,env.TELEGRAM_WEBHOOK_SECRET);assert.doesNotMatch(await response.text(),/abcdef0123456789_XY/);});
