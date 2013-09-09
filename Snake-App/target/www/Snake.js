(function() {
  var scope, _ref, _ref1;

  scope = typeof window !== "undefined" && window !== null ? window : this;

  scope.Ubidreams = (_ref = scope.Ubidreams) != null ? _ref : {};

  scope.Ubidreams.Snake = (_ref1 = scope.Ubidreams.Snake) != null ? _ref1 : {};

  scope.Ubidreams.Snake.impl = {
    /* LOCAL ATTRIBUTES
    */

    hub: null,
    direction: null,
    score: null,
    gameloop: null,
    food: null,
    speed: null,
    snake_array: null,
    canvas: null,
    CELL_SIZE: 10,
    DIR_LEFT: 37,
    DIR_UP: 38,
    DIR_RIGHT: 39,
    DIR_DOWN: 40,
    WIDTH: 450,
    HEIGHT: 450,
    DEFAULT_SNAKE_LENGTH: 5,
    DEFAULT_SNAKE_SPEED: 300,
    BG_COLOR: "white",
    BORDER_COLOR: "silver",
    SNAKE_COLOR: "black",
    SNAKE_BORDER_COLOR: "gray",
    /* HUBU COMPONENT CONTRACT IMPLEMENTATION
    */

    getComponentName: function() {
      return "Snake";
    },
    configure: function(hub, configuration) {
      var canvas;
      this.hub = hub;
      this.container = document.getElementById(configuration.container);
      canvas = $('<canvas />', {
        Width: this.WIDTH,
        Height: this.HEIGHT,
        "class": "snake-canvas"
      })[0];
      $(this.container).append(canvas);
      this.canvas = canvas.getContext("2d");
      $(document).keydown(Uju.bind(this, function(e) {
        var key;
        key = e.which;
        if (Math.abs(this.direction - key) !== 2) {
          return this.direction = key;
        }
      }));
    },
    start: function() {
      this.newGame();
    },
    stop: function() {},
    /* PRIVATE FUNCTIONS
    */

    /*
    # Start new game
    */

    newGame: function() {
      this.direction = this.DIR_RIGHT;
      this.score = 0;
      this.create_snake();
      this.create_food();
      if (this.game_loop != null) {
        clearInterval(this.game_loop);
      }
      this.game_loop = setInterval(Uju.bind(this, this.render), this.DEFAULT_SNAKE_SPEED);
    },
    /*
    # Init snake
    */

    create_snake: function() {
      var i;
      this.snake_array = [];
      i = this.DEFAULT_SNAKE_LENGTH - 1;
      while (i >= 0) {
        this.snake_array.push({
          x: i,
          y: 0
        });
        i--;
      }
    },
    /*
    # Spawn food at random cooridnates
    */

    create_food: function() {
      this.food = {
        x: Math.round(Math.random() * (this.WIDTH - this.CELL_SIZE) / this.CELL_SIZE),
        y: Math.round(Math.random() * (this.HEIGHT - this.CELL_SIZE) / this.CELL_SIZE)
      };
    },
    /*
    # Render the canvas with the snake
    */

    render: function() {
      var i, tail, x, y, _i, _ref2;
      this.canvas.fillStyle = this.BG_COLOR;
      this.canvas.fillRect(0, 0, this.WIDTH, this.HEIGHT);
      this.canvas.strokeStyle = this.BORDER_COLOR;
      this.canvas.strokeRect(0, 0, this.WIDTH, this.HEIGHT);
      x = this.snake_array[0].x;
      y = this.snake_array[0].y;
      if (this.direction === this.DIR_RIGHT) {
        x++;
        console.log("right");
      } else if (this.direction === this.DIR_LEFT) {
        x--;
        console.log("left");
      } else if (this.direction === this.DIR_UP) {
        y--;
        console.log("up");
      } else if (this.direction === this.DIR_DOWN) {
        y++;
        console.log("down");
      }
      if (x === -1 || x === this.WIDTH / this.CELL_SIZE || y === -1 || y === this.HEIGHT / this.CELL_SIZE || this.check_collision(x, y)) {
        this.endGame();
        return;
      }
      if (x === this.food.x && y === this.food.y) {
        tail = {
          x: x,
          y: y
        };
        this.score++;
        this.create_food();
      } else {
        tail = this.snake_array.pop();
        tail.x = x;
        tail.y = y;
      }
      this.snake_array.unshift(tail);
      i = 0;
      for (i = _i = 0, _ref2 = this.snake_array.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        this.draw_cell(this.snake_array[i].x, this.snake_array[i].y);
      }
      this.draw_cell(this.food.x, this.food.y);
      this.canvas.fillText("Score: " + this.score, 5, this.HEIGHT - 5);
    },
    /*
    # Draw a cell
    # x: the x coordinate for the cell to draw
    # y: the u coordinate for the cell to draw
    */

    draw_cell: function(x, y) {
      this.canvas.fillStyle = this.SNAKE_COLOR;
      this.canvas.fillRect(x * this.CELL_SIZE, y * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);
      this.canvas.strokeStyle = this.SNAKE_BORDER_COLOR;
      this.canvas.strokeRect(x * this.CELL_SIZE, y * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);
    },
    /*
    # Check if the snake is going to collide with itself
    # x: the target cell x coordinate
    # y: the target cell y coordinate
    */

    check_collision: function(x, y) {
      var i, _i, _ref2;
      for (i = _i = 0, _ref2 = this.snake_array.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        if (this.snake_array[i].x === x && this.snake_array[i].y === y) {
          return true;
        }
        i++;
      }
      return false;
    },
    /*
    # End the game
    */

    endGame: function() {
      if (this.game_loop != null) {
        clearInterval(this.game_loop);
      }
      return alert("lost");
    }
  };

}).call(this);