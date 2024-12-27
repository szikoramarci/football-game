import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from '../../services/app/app.service';
import { BaseLayerComponent } from '../layers/base/base.layer.component';
import { StateLayerComponent } from '../layers/state/state.layer.component';
import { ActiveLayerComponent } from '../layers/active/active.layer.component';
import { PassingIndicatorLayerComponent } from '../layers/passing-indicator/passing-indicator.layer.component';
import { MovingIndicatorLayerComponent } from '../layers/moving-indicator/moving-indicator.layer.component';
import { MouseEventService } from '../../services/mouse-event/mouse-event.service';
import { SelectionIndicatorLayerComponent } from '../layers/selection-indicator/selection-indicator.layer.component';
import { TacklingIndicatorLayerComponent } from '../layers/tackling-indicator/tackling-indicator.layer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BaseLayerComponent,
    StateLayerComponent,
    MovingIndicatorLayerComponent,
    PassingIndicatorLayerComponent,
    TacklingIndicatorLayerComponent,
    SelectionIndicatorLayerComponent,
    ActiveLayerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  @ViewChild('gameboard') gameBoard!: ElementRef;

  constructor(
    private app: AppService,
    private mouseEvent: MouseEventService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.app.init();
    this.appendGraphics();    
  }

  appendGraphics(){
    this.gameBoard.nativeElement.appendChild(this.app.getCanvas());
    this.mouseEvent.initClickListener(this.app.getCanvas())
  }

}
