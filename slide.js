
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
        this.arrSize = [3, 4, 5, 5, 6];
        this.level = 5;
        this.moves = 0;
        this.moves_per_level = [];
        this.total_moves = 0;
        this.n = 300;
        this.size = 40; // should be the same as .cell width and height in css
        this.size = this.n / this.arrSize[this.level-1]

        this.create_table();
        this.bind_events();
        // this.create_game();
    }

    create_table = ()=>{
        this.table = $('<table border="0" class="table1"></table>');
        this.bool = true;
        for(let i=0; i<this.arrSize[this.level-1]; i++) {
            let row = $('<tr></tr>');
            for(let j=0; j<this.arrSize[this.level-1]; j++){
                this.cell_count++;
                let cell = $('<td class="cell" data-xy="' + j + "," + i + '" data-value="' + this.cell_count + '">' + this.cell_count + '</td>');
                cell.css({"top": (this.size*i) + "px", "left": (this.size*j) + "px", "width": this.size, "height": this.size});
                
                row.append(cell);
                this.add_image(cell);
            }
            this.table.append(row);
        }
        this.container.append(this.table);
        this.last_cell = $(".cell").last();
    }

    add_image = (c)=>{
        let xy = c.attr("data-xy").split(",");
        let x = xy[0];
        let y = xy[1];
        let top = y * this.size;
        let right = this.size * (this.arrSize[this.level-1] - x - 1);
        let bottom = this.size * (this.arrSize[this.level-1] - y - 1);
        let left = x * this.size;

        if(true){
            console.log("top:", top, "right:", right, "bottom:", bottom, "left:", left, "xy:", xy.join(","), "c:", c.attr("data-value"))
            this.bool = false;
        }
        c.css("background-image", "url(" + this.images[this.level-1] + ")");
        //c.css("clip-path", "inset(" + top + "px " + right + "px " + bottom + "px " + left + "px )");
        
        c.css("background-position", " " + (this.n - left) + "px  " + (this.n - top) + "px");
        
        
    }

    bind_events = ()=>{
        this.cells = $(".cell");
        this.cells.on("click", (e)=>{
            //console.log($(e.currentTarget).attr("data-xy"), "::", $(e.currentTarget).attr("data-value"))
            //console.log("last cell:", this.last_cell.attr("data-xy"), "::", this.last_cell.attr("data-value"))
            let swappable = this.check_if_swappable($(e.currentTarget));
            if(swappable){
                let attr = $(e.currentTarget).attr("data-xy");
                $(e.currentTarget).attr("data-xy", this.last_cell.attr("data-xy"));
                this.last_cell.attr("data-xy", attr);

                let x = attr.split(",")[0];
                let y = attr.split(",")[1];
                this.last_cell.css({"top":y * this.size, "left":x * this.size});

                attr = $(e.currentTarget).attr("data-xy");
                x = attr.split(",")[0];
                y = attr.split(",")[1];
                $(e.currentTarget).css({"top":y * this.size, "left":x * this.size}); 
            }
        }); 
        
    }

    check_if_swappable = (c)=>{
        let data = c.attr("data-xy").split(",");
        let data_x = data[0];
        let data_y = data[1];

        let last = this.last_cell.attr("data-xy").split(",");
        let last_x = last[0];
        let last_y = last[1];

        if(this.last_cell.attr("data-value") != c.attr("data-value")){
            if(data_x == last_x){
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

    create_game = ()=>{
        
            $("#pic" + this.level).css("display","block");
         
    }



}


$(document).ready(function(){
    $("#startCont").fadeIn(1000);
    $("#innerBox").width($("#container").innerWidth() - 30).height($("#container").innerHeight() - 30).css("margin","15px auto");

    let slide = new SlidePuzzle("#box");
    slide.create_game();

       // eventList   
    $("#startBut").on("click", function() {
       $("#startCont").fadeOut(700); 
       $("#pics").css("display","block");
       //setTimeout( randomize,800);
    })
    $("#restartBut").on("click", function() {
       $("#finished").fadeOut(500);
       level = 1;
       setTimeout( randomize,800);
    })
    
    
});