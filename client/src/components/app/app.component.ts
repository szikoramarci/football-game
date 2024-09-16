import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from '../../services/app/app.service';
import { BaseLayerComponent } from '../layers/base/base.layer.component';
import { StateLayerComponent } from '../layers/state/state.layer.component';
import { ActiveLayerComponent } from '../layers/active/active.layer.component';
import { IndicatorLayerComponent } from '../layers/indicator/indicator.layer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BaseLayerComponent,
    StateLayerComponent,
    IndicatorLayerComponent,
    ActiveLayerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  @ViewChild('gameboard') gameBoard!: ElementRef;

  constructor(
    private app: AppService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.app.init();
    this.appendGraphics();    
  }

  appendGraphics(){
    this.gameBoard.nativeElement.appendChild(this.app.getCanvas());
  }

}
