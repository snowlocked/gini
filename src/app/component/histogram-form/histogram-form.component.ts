import { Component, OnInit, Input,EventEmitter,Output } from '@angular/core';
import { FormBuilder, FormGroup,FormControl } from '@angular/forms';

@Component({
  selector: 'app-histogram-form',
  templateUrl: './histogram-form.component.html',
  styleUrls: ['./histogram-form.component.less']
})
export class HistogramFormComponent implements OnInit {
  @Input() middle: number = 100
  @Input() gini: number = 0
  @Output() readonly startRun = new EventEmitter()
  @Output() readonly endRun = new EventEmitter()
  FormData: FormGroup

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.FormData = this.fb.group({
      peoples: new FormControl(100),
      rate: new FormControl(0),
      years: new FormControl(40)
    });
  }

  start():void{
    // console.log(this.FormData.value)
    this.startRun.emit(this.FormData.value)
  }
  stop():void{
    this.endRun.emit()
  }
}
