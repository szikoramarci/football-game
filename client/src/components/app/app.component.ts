import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from '../../services/app/app.service';
import { BaseLayerComponent } from '../layers/base/base.layer.component';
import { StateLayerComponent } from '../layers/state/state.layer.component';
import { ActiveLayerComponent } from '../layers/active/active.layer.component';
import { PasingIndicatorLayerComponent } from '../layers/pasing-indicator/passing-indicator.layer.component';
import { MovingIndicatorLayerComponent } from '../layers/moving-indicator/moving-indicator.layer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BaseLayerComponent,
    StateLayerComponent,
    MovingIndicatorLayerComponent,
    PasingIndicatorLayerComponent,
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
