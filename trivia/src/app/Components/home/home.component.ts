import { NameDialogComponent } from './../name-dialog/name-dialog.component';
import { questions } from './../../questions';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  questionBank = [];
  answers = [];
  name = "";
  selectedOptions = [];
  storyId = '';
  result = {
    attempted:0,
    correct:0,
    percentage:0
  }
  qstn;
  firstOpt;
  time = {
    minutes:0,
    seconds:0,
    elapsed:true,
    started:false
  }
  notification = false;
  constructor(
    private matDialog: MatDialog
  ) { }

  async ngOnInit() {
    await this.randomizeArray();
    await this.trimQuestionData();
  }

  //starting new Quiz session
  async reset(){
    this.notification = false;
    await this.randomizeArray();
    await this.trimQuestionData();
  }
  //Getting random 10 questions
  async randomizeArray(){
    this.questionBank = [...Array(10)].map( ()=> questions[this.randomNumber()]); 
  }

  //Getting a unique random number between 1 to the last time of the question array
  randomNumber(){
    let start = 1;
    let last = questions.length + 1
    return (Math.floor(Math.random() * (last - start))) + start
  }
  //Adjusting the question data to present the question options as array with unique id
  async trimQuestionData(){
    this.questionBank.forEach(el=>{
      el['options'] = [
      {
        id: `${el.id}a`,
        label:'A',
        option:el.A
      },
      {
        id:`${el.id}b`,
        label:'B',
        option:el.B
      },
      {
        id:`${el.id}c`,
        label:'C',
        option:el.A
      },
      {
        id:`${el.id}d`,
        label:'D',
        option:el.D
      },
    ]
    })
  }
  submit(){
    let correctAnswers = this.answers.filter(item=>{
      return item.choice == item.answer;
    })
    this.result.correct = correctAnswers.length;
    this.result.attempted = this.answers.length;
    this.result.percentage = Math.floor( this.result.correct/10 * 100);
    this.notification = true;
  }
  selectAnswer(qid,ans,oid,answer){
    let data = {
      qid:qid,
      oid:oid,
      choice:ans,
      answer: answer
    };
    if(this.answers.length > 0){
      this.firstOpt = null;
      let filter = this.answers.filter(e=>{
        return e.qid == qid
      })
      if (filter.length == 0){
        this.answers.push(data);
        const sOpt = []
        this.answers.forEach(option=>{
          sOpt.push(option.oid)
        })
        this.selectedOptions = sOpt;
      }
      if (filter.length > 0){
        let opt = this.answers.filter(item=>{
          return item != filter[0]
        })
        opt.push(data)
        this.answers = opt;
        const sOpt = []
        this.answers.forEach(option=>{
          sOpt.push(option.oid)
        })
        this.selectedOptions = sOpt;
      }
    }
    else{
      this.answers.push(data);
      this.firstOpt = oid;
      const sOpt = []
      this.answers.forEach(option=>{
        sOpt.push(option.oid)
      })
    }
  }

  //Determing greeting according to day time
  dayTime(){
    let hr = new Date().getHours();
    if(hr < 12){
      return "Good Morning"
    }
    if(hr >= 12 && hr < 16){
      return "Good Afternoon"
    }
    if(hr >= 16){
      return "Good Evening"
    }
  }
  start(){
    this.time.started = true;
    //seconds equivalent of 5 minutes
    let distance = 300-1;
    this.time.seconds = 59;
    this.time.minutes = 4;
    // Update the count down every 1 second
    let countDown = setInterval(() =>{
      distance--;
      this.time.seconds--;
      if(this.time.seconds == 0){
        this.time.seconds = 59;
        this.time.minutes--;
      }
      if(distance < 1){
        this.time.elapsed = true;
        this.time.started = false;
        this.time.seconds = 0;
        this.time.minutes = 0;
        this.submit();
        clearInterval(countDown);
      }
    }, 1000);
  }

  //To pop up matdialog box for name collection
  submitName(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '576px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.closeOnNavigation = true;
    let dialogRef = this.matDialog.open(NameDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.name = result.name
        this.start() 
      }   
    });
  }
}
