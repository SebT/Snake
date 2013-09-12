scope = window ? @
scope.Ubidreams = scope.Ubidreams ? {}
scope.Ubidreams.Snake = scope.Ubidreams.Snake ? {}

scope.Ubidreams.Snake.impl = {
  ### LOCAL ATTRIBUTES ###
  hub: null
  direction: null
  score: null
  gameloop: null
  food: null
  speed: null
  snake_array: null
  canvas: null
  endPopUp: null
  CELL_SIZE: 10 # in pixels
  DIR_LEFT: 37
  DIR_UP: 38
  DIR_RIGHT: 39
  DIR_DOWN: 40
  # GAME SETTING #
  WIDTH: 450
  HEIGHT: 450
  DEFAULT_SNAKE_LENGTH: 5
  DEFAULT_SNAKE_SPEED: 300 # (milliseconds to move one cell)
  MINIMUM_SNAKE_SPEED: 20
  BG_COLOR: "white"
  BORDER_COLOR: "silver"
  SNAKE_COLOR: "black"
  SNAKE_BORDER_COLOR: "gray"

  ### HUBU COMPONENT CONTRACT IMPLEMENTATION ###
  getComponentName: ->
    return "Snake"

  configure: (hub, configuration) ->
    @hub = hub

    # Retrieve container & game over div
    @container = $(document.getElementById(configuration.container))
    @popup = $(document.getElementById(configuration.gameOverPopup))
    @scoreNode = @popup.find("p")
    @button = @popup.find("button")

    # Handle the replay button click
    @button.click(Uju.bind(@, @newGame))

    # Draw canvas
    canvas = $('<canvas />', {Width:@WIDTH, Height:@HEIGHT, class:"snake-canvas"})[0]
    @container.append(canvas)
    @canvas = canvas.getContext("2d")
    @canvas.font = "20px Georgia";
    return

  start: ->
    @newGame()
    return

  stop: ->
    return

  ### PRIVATE FUNCTIONS ###
  
  ###
  # Start new game
  ###
  newGame: ->
    # Show canvas
    $("canvas").show()
    @popup.hide()

    # Init variables
    @direction = @DIR_RIGHT
    @score = 0

    # Set keyboard control
    @setKeyboardControls()

    # Create snake and random food
    @create_snake()
    @create_food()

    # Start timer to make the snake move
    @speed = @DEFAULT_SNAKE_SPEED
    @moveSnake()
    return

  ###
  # Init snake
  ###
  create_snake: ->
    @snake_array = []
    i = @DEFAULT_SNAKE_LENGTH - 1

    # Create a horizontal snake
    # The head will be the first cell of the array while the tail will be the last one
    while i >= 0
      @snake_array.push
        x: i
        y: 0
      i--
    return

  ###
  # Spawn food at random cooridnates
  ###
  create_food: ->
    loop
      x = Math.round(Math.random() * (@WIDTH - @CELL_SIZE) / @CELL_SIZE)
      y = Math.round(Math.random() * (@HEIGHT - @CELL_SIZE) / @CELL_SIZE)
      break if not @check_collision(x, y)

    @food =
      x: x
      y: y

    return

  moveSnake: ->
    clearTimeout(@game_loop) if @game_loop?
    @game_loop = setTimeout(Uju.bind(@, @moveSnake), @speed)
    @render()

  ###
  # Render the canvas with the snake
  ###
  render: ->
    # Draw the canvas (blank)
    @canvas.fillStyle = @BG_COLOR
    @canvas.fillRect 0, 0, @WIDTH, @HEIGHT
    @canvas.strokeStyle = @BORDER_COLOR
    @canvas.strokeRect 0, 0, @WIDTH, @HEIGHT

    # Get snake head pos
    x = @snake_array[0].x
    y = @snake_array[0].y

    # Get the cell the snake is heading to
    if @direction is @DIR_RIGHT
      x++
    else if @direction is @DIR_LEFT
      x--
    else if @direction is @DIR_UP
      y--
    else if @direction is @DIR_DOWN
      y++

    # Check if the snake is heading out of screen or colliding with itself
    if x is -1 or x is @WIDTH / @CELL_SIZE or y is -1 or y is @HEIGHT / @CELL_SIZE or @check_collision(x, y)
      @endGame()
      return

    # Check if the snake hit food
    # If it did, add a cell as the tail
    if x is @food.x and y is @food.y
      tail =
        x: x
        y: y
      @score++
      @speed *= 0.9 if @speed > @MINIMUM_SNAKE_SPEED
      @create_food()
    # Else, just move the tail
    else
      tail = @snake_array.pop()
      tail.x = x
      tail.y = y
    @snake_array.unshift tail
    i = 0

    # Then, draw the rest of the snake
    @draw_cell(@snake_array[i].x, @snake_array[i].y) for i in [0...@snake_array.length]

    # And draw the food
    @draw_cell @food.x, @food.y

    #Lets paint the score
    @canvas.fillText "Score: " + @score, 5, @HEIGHT - 5
    return

  ###
  # Draw a cell
  # x: the x coordinate for the cell to draw
  # y: the u coordinate for the cell to draw
  ###
  draw_cell: (x, y) ->
    @canvas.fillStyle = @SNAKE_COLOR
    @canvas.fillRect x * @CELL_SIZE, y * @CELL_SIZE, @CELL_SIZE, @CELL_SIZE
    @canvas.strokeStyle = @SNAKE_BORDER_COLOR
    @canvas.strokeRect x * @CELL_SIZE, y * @CELL_SIZE, @CELL_SIZE, @CELL_SIZE
    return

  ###
  # Check if the snake is going to collide with itself
  # x: the target cell x coordinate
  # y: the target cell y coordinate
  ###
  check_collision: (x, y) ->
    for i in [0...@snake_array.length]
      return true  if @snake_array[i].x is x and @snake_array[i].y is y
      i++
    return false

  ###
  # End the game
  ###
  endGame: ->
    clearTimeout(@game_loop) if @game_loop?
    @disableControls()
    $("canvas").hide()
    @scoreNode.html("Your score: " + @score)
    @popup.show()


  ###
  # Set keyboard control for arrows
  ###
  setKeyboardControls: ->
    @disableControls()
    $(document).keydown(Uju.bind(@, (e) ->
      key = e.which
      # Set direction if it isn't the opposite of the current one
      @direction = key if Math.abs(@direction-key) isnt 2
      @moveSnake()
    ))

  disableControls: ->
    $(document).unbind("keydown")
}