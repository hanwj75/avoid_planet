class Player {
  WALK_ANIMATION_TIMER = 200;
  walkAnimationTimer = this.WALK_ANIMATION_TIMER;
  dinoRunImages = [];

  //기모으기 타이머
  ENERGY_TIMER = 10;
  energyAnimationTimer = this.ENERGY_TIMER;
  energyImages = [];

  //점프 상태값
  jumpPressed = false;
  jumpInProgress = false;
  falling = false;
  sitting = false;

  JUMP_SPEED = 1;
  GRAVITY = 0;

  // 생성자
  constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = width;
    this.height = height;
    this.minJumpHeight = minJumpHeight;
    this.maxJumpHeight = maxJumpHeight;
    this.scaleRatio = scaleRatio;

    this.x = 15 * scaleRatio;
    this.y = this.canvas.height - this.height - 1.5 * scaleRatio;
    // 기본 위치 상수화
    this.yStandingPosition = this.y;

    this.standingStillImage = new Image();
    this.standingStillImage.src = "images/나는비행기.png";

    this.image = this.standingStillImage;
    //앉기 이미지
    this.sittingImage = new Image();
    this.sittingImage.src = "images/방패비행기.png";
    this.image = this.sittingImage;

    //기 모으기

    const energyImage1 = new Image();
    energyImage1.src = "images/기모으기1.png";

    const energyImage2 = new Image();
    energyImage2.src = "images/기모으기2.png";

    this.energyImages.push(energyImage1);
    this.energyImages.push(energyImage2);

    // 달리기
    const dinoRunImage1 = new Image();
    dinoRunImage1.src = "images/그냥비행기.png";

    const dinoRunImage2 = new Image();
    dinoRunImage2.src = "images/그냥비행기2.png";

    this.dinoRunImages.push(dinoRunImage1);
    this.dinoRunImages.push(dinoRunImage2);

    // 키보드 설정
    // 등록된 이벤트가 있는 경우 삭제하고 다시 등록
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);

    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
  }

  keydown = (event) => {
    if (event.code === "Space") {
      this.jumpPressed = true;
      this.GRAVITY = 0;
      this.falling = false;
    }
    if (event.code === "KeyX") {
      this.sitting = true;
      this.image = this.sittingImage;
    }
    if (event.code === "KeyC") {
      if (this.energyAnimationTimer <= 0 && !this.sitting) {
        // 에너지를 모으기 애니메이션 로직 수정
        this.energyAnimationTimer = this.ENERGY_TIMER; // 타이머 리셋
        if (this.image === this.energyImages[0]) {
          this.image = this.energyImages[1];
        } else {
          this.image = this.energyImages[0];
        }
      }
    }
  };

  keyup = (event) => {
    if (event.code === "Space") {
      this.jumpPressed = false;
      this.GRAVITY = 1;
    }

    //방패내리기
    if (event.code === "KeyX") {
      this.sitting = false;
      this.image = this.standingStillImage;
    }
  };

  update(gameSpeed, deltaTime) {
    this.run(gameSpeed, deltaTime);

    if (this.jumpInProgress) {
      this.image = this.standingStillImage;
    }

    this.jump(deltaTime);

    if (this.energyAnimationTimer > 0) {
      this.energyAnimationTimer -= deltaTime;
    }
  }

  jump(deltaTime) {
    if (this.jumpPressed) {
      this.jumpInProgress = true;
    }

    // 점프가 진행중이고 떨어지는중이 아닐때
    if (this.jumpInProgress && !this.falling) {
      // 현재 인스턴스의 위치가 점프의 최소, 최대값의 사이일때
      if (
        this.y > this.canvas.height - this.minJumpHeight ||
        (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)
      ) {
        // 아무튼 위의 내용은 버튼을 눌렀을때 올라가는 조건
        this.y -= this.JUMP_SPEED * deltaTime * this.scaleRatio;
      } else {
        this.falling = true;
      }
      // 떨어질 때
    } else {
      if (this.y < this.yStandingPosition) {
        this.y += this.GRAVITY * deltaTime * this.scaleRatio;

        // 혹시 위치가 어긋 났을때 원래 위치로
        if (this.y + this.height > this.canvas.height) {
          this.y = this.yStandingPosition;
        }
      } else {
        this.falling = false;
        this.jumpInProgress = false;
      }
    }
  }

  run(gameSpeed, deltaTime) {
    if (this.walkAnimationTimer <= 0 && !this.sitting) {
      if (this.image === this.dinoRunImages[0]) {
        this.image = this.dinoRunImages[1];
      } else {
        this.image = this.dinoRunImages[0];
      }
      this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    }

    this.walkAnimationTimer -= deltaTime * gameSpeed;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

export default Player;
