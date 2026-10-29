import {beforeEach,describe,expect,it} from 'vitest';
import {TestBed} from '@angular/core/testing';
import {App} from './app';
import {newGame,runInput} from './core/engine/game';
import {SCENARIO_PATHS,SCENARIO_REVIEW_PATH,SCENARIO_SIGNED_PATH} from './core/engine/scenario-playthroughs';
import {decodeSave} from './core/persistence/saves';
const play=(steps:readonly string[])=>steps.reduce((s,i)=>runInput(s,i).state,newGame());
describe('v1.0 terminal presentation',()=>{
  beforeEach(()=>{localStorage.clear();TestBed.configureTestingModule({imports:[App]});});
  it('restores a MOTHER turn after CLEAR with free input and no quiz/modal',()=>{
    const fixture=TestBed.createComponent(App);const app=fixture.componentInstance;
    app.session.state.set(decodeSave(JSON.stringify(play([...SCENARIO_REVIEW_PATH,'CLEAR']))).state);app.stage.set('desktop');fixture.detectChanges();
    const e=fixture.nativeElement as HTMLElement;
    expect(e.querySelector('[aria-label="Pending MOTHER question"]')?.textContent).toContain('May I ask you a question?');
    expect(e.querySelector('#terminal-command')).toBeTruthy();expect(e.querySelector('[role="alertdialog"]')).toBeNull();expect(e.querySelector('[aria-label="Pending investigation verification"]')).toBeNull();
    expect(e.querySelector('.clock')?.textContent).toBe('07 NOV 2003 / 22:10');fixture.destroy();
  });
  it.each(['MAINTAIN SUPPORT','SUBMIT SEPARATION WITNESS'])('keeps the %s risk warning available when scrollback is cleared',input=>{
    const fixture=TestBed.createComponent(App);const app=fixture.componentInstance;
    app.session.state.set(decodeSave(JSON.stringify(play([...SCENARIO_SIGNED_PATH,input,'CLEAR']))).state);app.stage.set('desktop');fixture.detectChanges();
    const e=fixture.nativeElement as HTMLElement;
    expect(e.querySelector('details[aria-label="Pending procedural choice"] pre')?.textContent).toContain('TYPE CONFIRM OPERATION');
    expect(e.querySelector('[role="alertdialog"]')).toBeNull();expect(e.querySelector('#terminal-command')).toBeTruthy();
    expect(e.querySelector('details pre')?.textContent).toContain(input==='MAINTAIN SUPPORT'?'Documented distress-associated responses may continue.':'Mara: HIGH RISK');fixture.destroy();
  });
  it.each(Object.entries(SCENARIO_PATHS))('renders the authored %s outcome and returns to records',(outcome,steps)=>{
    const fixture=TestBed.createComponent(App);const app=fixture.componentInstance;app.session.state.set(play(steps));app.stage.set('desktop');fixture.detectChanges();
    const e=fixture.nativeElement as HTMLElement;
    expect(e.querySelector('.ending-card')?.textContent).toContain(outcome==='severance'?'EXTERNAL WITNESS RECEIPT: VERIFIED':'WITNESS RECEIPT: WITHHELD');
    expect(e.querySelector('.ending-card')?.textContent).toContain('11 NOV 2003');app.review();fixture.detectChanges();expect(e.querySelector('.ending-card')).toBeNull();fixture.destroy();
  });
  it('B06 reports actual v1.0 findings before an ending',()=>{
    const fixture=TestBed.createComponent(App);const app=fixture.componentInstance;
    app.session.state.set(play(['COMPARE SERVICES','REPORT DISCREPANCY']));
    expect(app.findings().join('\n')).toContain('closure compared');expect(app.findings().join('\n')).toContain('audit accepted');fixture.destroy();
  });
  it.each(['MAINTAIN SUPPORT','SUBMIT SEPARATION WITNESS'])('B04 removes an unanswered MOTHER invitation after %s',choice=>{
    const fixture=TestBed.createComponent(App);const app=fixture.componentInstance;
    const steps=SCENARIO_SIGNED_PATH.filter(input=>input!=='Yes please'&&input!=='I dont know');
    app.session.state.set(play([...steps,choice,'CONFIRM OPERATION']));app.stage.set('desktop');fixture.detectChanges();app.review();fixture.detectChanges();
    const e=fixture.nativeElement as HTMLElement;
    expect(e.querySelector('[aria-label="Pending MOTHER question"]')).toBeNull();expect(e.querySelector('#terminal-command')).toBeTruthy();fixture.destroy();
  });
});
