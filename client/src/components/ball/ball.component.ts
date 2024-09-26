import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { GridService } from "../../services/grid/grid.service";
import { HexCoordinates } from "honeycomb-grid";
import { getBallPosition } from "../../stores/ball-position/ball-position.selector";
import { AnimateService } from "../../services/animate/animate.service";

@Component({
    selector: 'ball',
    standalone: true,
    templateUrl: './ball.component.html',
})
export class BallComponent implements OnInit, OnDestroy {

    @Output() onGraphicsChanged = new EventEmitter<Container>()
    
    graphics: Container = new Container();  

    ballMovementSubscription!: Subscription;

    constructor(
        private store: Store,
        private grid: GridService,
        private animate: AnimateService
    ) {}

    ngOnInit(): void { 
        this.generateBall();
        this.sendGraphics();        
        this.initPlayerPositionSubscription();       
    }

    initPlayerPositionSubscription() {        
        this.ballMovementSubscription = this.store.select(getBallPosition())
            .subscribe(position => {                               
                this.moveBall(position);
            })
    }

    moveBall(newCoordinates: HexCoordinates) {
        const hex = this.grid.getHex(newCoordinates);                
        if (hex) {            
            this.animate.move(this.graphics, hex)      
        }
    }

    async generateBall(){        

        const token = new Graphics().circle(0, 0, 16);  
        token.fill('white');
        this.graphics.addChild(token);

        const texture = await Assets.load('http://localhost:4200/football.png');
        const ball = new Sprite(texture);
        ball.width = 32;
        ball.height = 32;
        ball.x = -16;
        ball.y = -16
        this.graphics.addChild(ball);
    }


    sendGraphics() {        
        this.onGraphicsChanged.emit(this.graphics);
    }

    ngOnDestroy(): void {
        this.graphics.destroy();
        this.ballMovementSubscription?.unsubscribe();
    }
}