import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
export class Message {
  constructor(public author: string, public content: string) {}
}
@Injectable()
export class ChatService {
  constructor() {}
  conversation = new Subject<Message[]>();
  messageMap : any= {
    "hi": "Hello, Type Start To get started, Type Reset to reset the form",
    "who are you": "My name is Medication Bot",
    "what is your role": "Just guide for the user",
    "defaultmsg": "I can't understand your text. Can you please repeat",
    "start":"What is your name?",
    "medicine": "What is the medicine name?",
    "dosage": "select dosage timings and press enter",
    "fromdate": "Select start date and press enter",
    "todate": "select end date and press enter",
    "symptoms": "Select the symptoms and press enter",
    "reset":" Form has been reset",
    "end": "Thank you for using Medication Bot. Report has been mailed to your email. Please check your inbox",

  }
  getBotAnswer(msg: string) {
    const userMessage = new Message('user', msg);
    this.conversation.next([userMessage]);
    const botMessage = new Message('bot', this.getBotMessage(msg));
    setTimeout(()=>{
      this.conversation.next([botMessage]);
    }, 1000);
  }
  getBotMessage(question: string){
    let answer = this.messageMap[question.toLowerCase()];
    return answer || this.messageMap['defaultmsg'];
  }
  getMedicalBotAnswer(userValue: string, question: string) {
    const userMessage = new Message('user', userValue);
    this.conversation.next([userMessage]);
    const botMessage = new Message('bot', this.getBotMessage(question));
    setTimeout(()=>{
      this.conversation.next([botMessage]);
    }, 1000);
}
}