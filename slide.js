

let shit = [1,2,3,[4,5],[6,[7,[8,9,10], 1 ], [2,3]]]
console.log(shit.flat(3).join(""))

class SlidePuzzle{
    constructor(container){
               
        this.container = $(container);
        this.cell_count = 0;
        this.titles = ["The Sololearn Logo", "The Cat", "The Pokemon", "The Castle", "The Quote"];
        this.images = ["https://i.imgur.com/BhY6UxK.jpg", 
                        "https://i.imgur.com/pWLS31d.jpg",
                        "https://i.imgur.com/cL9LmZI.jpg", 
                        "https://i.imgur.com/XJy9SF4.jpg",
                        "https://i.imgur.com/se177BC.jpg",
                        "https://i.imgur.com/icCIJK2.jpg"
                    ];
        this.arrSize = [3, 4, 5, 5, 6]; // board sizes for every level
        this.level = 1;
        this.current_level_moves = 0;
        this.moves_per_level = [];
        this.total_moves = 0;
        this.n = 300; // base width and height for images.
        this.size = this.n / this.arrSize[this.level-1] // width and height of each piece. 
        this.speed = 150; // speed of random moves
        this.random_moves = 50;
        this.solved_state = [];
        this.current_state = [];

        this.create_table();
        this.bind_events();
    }

    create_table = ()=>{
        // resetting previous values
        this.table = $('<table border="0" class="table1"></table>');
        this.current_state = [];
        this.solved_state = [];
        this.cell_count = 0;

        // populating table with td. 
        // populating current_state and solved_state.
        for(let i=0; i<this.arrSize[this.level-1]; i++) {
            let row = $('<tr></tr>');
            this.current_state[i] = [];
            for(let j=0; j<this.arrSize[this.level-1]; j++){
                this.cell_count++;
                let cell = $('<td class="cell" data-xy="' + j + "," + i + '" data-value="' + this.cell_count + '">' + '' + '</td>');
                cell.css({"top": (this.size*i) + "px", "left": (this.size*j) + "px", "width": this.size, "height": this.size});
                this.solved_state.push(this.cell_count);
                this.current_state[i].push(this.cell_count);
                
                row.append(cell);
                this.add_image(cell);
            }
            this.table.append(row);
        }

        this.container.html("").append(this.table); // appending to container
        this.last_cell = $(".cell").last(); // getting the last cell.
        this.last_cell.addClass("last_cell"); // making the last cell invisible
    }

    // adding appropriate background image parts for each piece.
    add_image = (c)=>{
        let xy = c.attr("data-xy").split(",");
        let x = xy[0];
        let y = xy[1];
        let top = y * this.size;
        let right = this.size * (this.arrSize[this.level-1] - x - 1);
        let bottom = this.size * (this.arrSize[this.level-1] - y - 1);
        let left = x * this.size;

        c.css("background-image", "url(" + this.images[this.level-1] + ")");
        //c.css("clip-path", "inset(" + top + "px " + right + "px " + bottom + "px " + left + "px )");
        c.css("background-position", " " + (this.n - left) + "px  " + (this.n - top) + "px");
    }

    // click event
    bind_events = ()=>{
        this.cells = $(".cell");
        this.cells.on("click", (e)=>{
            let swappable = this.check_if_swappable($(e.currentTarget));
            if(swappable){
                this.swap_cell($(e.currentTarget)); // swapping animation and state value swapping
                $("#moves").html("Moves : " + (++this.current_level_moves));
                $("#totalmoves").html("Total Moves : "+ (++this.total_moves));
                
                if(this.check_if_solved()){
                    //setTimeout(()=>{
                        this.level_up();
                    //},500); 
                }
            }
        }); 
    }

    level_up = ()=>{
        this.level++;
        this.moves_per_level.push(this.current_level_moves);

        // if last level is finished.
        if(this.level > this.arrSize.length){
            setTimeout(()=>{
                $("img").css("display","none");
                $("#fText").html(" You finished the game! <br> Congrats! <br> Your stats: <br> Level 1 : " + 
                this.moves_per_level[0] + " moves <br> Level 2 : " + 
                this.moves_per_level[1] + " moves <br> Level 3 : " + 
                this.moves_per_level[2] + " moves <br> Level 4 : " + 
                this.moves_per_level[3] + " moves <br> Level 5 : " + 
                this.moves_per_level[4] + " moves <br> Total : " + 
                this.total_moves + " moves <br> Thanks for playing.<br>😊");       

                $("#finished").fadeIn(200);
                
            },500);
            return;
        }
        // resetting values and adjusting size for new level
        this.current_level_moves = 0;
        this.size = this.n / this.arrSize[this.level-1];
        this.cell_count = 0;

        $("#congratsText").html("Congratulations! <br> You solved Level " + (this.level-1));
        $("#nextBut").html("Ready for <br> Level " + this.level + " ?");
        $("#nextLevel").fadeIn(500);
        let click = 1;
        // bind click event to button once then remove it after click
        $("#nextBut").on("click", ()=>{
            $("#nextLevel").fadeOut(200);
            $("#moves").html("Moves : "+ this.current_level_moves);
            // create new level
            this.create_table();
            this.bind_events();
            this.randomize();
            $("#nextBut").off(); // removing event right after using it to avoid double triggering which costed me hours of debugging and frustration.
        });
        
    }

    swap_cell = (cell)=>{
        // swapping cells using data attributes instead of array data.
        let attr = cell.attr("data-xy");
        cell.attr("data-xy", this.last_cell.attr("data-xy"));
        this.last_cell.attr("data-xy", attr);
        
        // coercing the values into integer to avoid string concatenation.
        let x = +attr.split(",")[0];
        let y = +attr.split(",")[1];
        let value = this.current_state[y][x];
        this.last_cell.css({"top":y * this.size, "left":x * this.size});
        this.current_state[y][x] = +this.last_cell.attr("data-value");
        
        attr = cell.attr("data-xy");
        x = +attr.split(",")[0];
        y = +attr.split(",")[1];
        cell.css({"top":y * this.size, "left":x * this.size});
        this.current_state[y][x] = value;
    }

    check_if_swappable = (c)=>{
        // check using data attribute of clicked element
        // checking if clicked element is neighbor of last_cell
        let data = c.attr("data-xy").split(",");
        let data_x = data[0];
        let data_y = data[1];

        let last = this.last_cell.attr("data-xy").split(",");
        let last_x = last[0];
        let last_y = last[1];

        // if the clicked cell is not the last_cell
        if(this.last_cell.attr("data-value") != c.attr("data-value")){
            // if both x values are the same, they are in same column
            if(data_x == last_x){
                // to determine if they are neighbors, 
                // the absolute value of their y difference should be 1
                if(Math.abs(data_y - last_y) == 1){
                    return true;
                }
                return false;
            }else if(data_y == last_y){
                if(Math.abs(data_x - last_x) == 1){
                    return true;
                }
                return false;
            }
        }
        return false;
    }

    check_if_solved = ()=> this.solved_state.join("-") == this.current_state.flat(2).join("-");
    
    show_hint = ()=>{
        $("#pic" + this.level).css("display","block");
    }

    randomize = ()=>{
        // speeding up the animation
        $(".cell").css("transition", "top 0.05s, left 0.05s");
        
        let count = 0; //
        $("#loadingText").html("Loading Level " + this.level );
        $("#loading").fadeIn(300);
        $("#level").html("Level "+ this.level);
        $("#title").html("'" + this.titles[this.level-1] + "'");
        if(this.level > this.arrSize.length-1) {
           $("#pic" + (this.level+1)).css("display","block");     
        }else {
           $("#pic" + this.level).css("display","block");
        }
        
        this.animation = setInterval(()=>{
            
            let neighbors = [];
            let xy = this.last_cell.attr("data-xy").split(",");
            let x = xy[0], y = xy[1];
           
            if(+y + 1 < this.arrSize[this.level-1] ) neighbors.push({x:+x, y:+y+1});
            if(+y - 1 >= 0) neighbors.push({x:+x, y:+y-1});
            if(+x - 1 >= 0) neighbors.push({x:+x-1, y:+y});
            if(+x + 1 < this.arrSize[this.level-1]) neighbors.push({x:+x+1, y:+y});

            let chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
            chosen = $("td[data-xy='" + chosen.x + "," + chosen.y + "']");
            this.swap_cell(chosen);
            count++;

            if(count >= this.random_moves ){
                this.stop();
                $("#loading").fadeOut(500);
                if(this.check_if_solved()) {
                    this.randomize();
                }
                return;
            }
        }, this.speed);
    }

    stop = ()=>{
        clearInterval(this.animation);
    }

}


$(document).ready(function(){
    $("#startCont").fadeIn(1000);
    $("#innerBox").width($("#container").innerWidth() - 30).height($("#container").innerHeight() - 30).css("margin","15px auto");

    let slide;

    // eventList   
    $("#startBut").on("click", function() {
        $("#startCont").fadeOut(700);
        $("#pics").css("display","block");
        slide = new SlidePuzzle("#box");
        slide.show_hint();
        setTimeout( slide.randomize,800);
    })

    $("#restartBut").on("click", function() {
        $("#finished").fadeOut(500);
        slide = new SlidePuzzle("#box");
        slide.show_hint();
        setTimeout( slide.randomize,800);
    })
    
    
});

