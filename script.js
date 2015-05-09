$(document).ready(function() {
	$('#header').click(function(e) {
		alert("hi");
	});

	var width = $(window).width();
	var height = $(window).height();
	var blockSize = $("#header").width();
	var blocksHor = Math.floor(width / blockSize);
	var blocksVer = Math.floor(height / blockSize);
	
	width = width - (blocksHor * 2);
	blocksHor = Math.floor(width / blockSize);
	
	height = height - (blocksVer * 2) - blockSize;
	blocksVer = Math.floor(height / blockSize);
	
	var blocksNeeded = blocksHor * blocksVer;

	var i = 0;
	
	for (i = 0; i < blocksNeeded; i++) {
		$("body").append('<div class="block"></div>');
	}

    var nodes = [];

	// Create Node class
	var Node = function(block) {
        this.blockInstance = block;
        this.name = nodes.length;
        this.table = [{destination: this.name, nextHop: 0, hopCount: 0, seqNo: 0}];

        nodeInfoContainer = document.createElement('div');
		nodeInfoContainer.className = 'node-info-container';

        nodeInfo = document.createElement('div');
        nodeInfo.className = 'node-info';
        //nodeInfo.innerHTML = '<p>' + 'Destination: ' + this.table[0].destination + ' | Next hop: ' + this.table[0].nextHop + '</p>';

        destinationInfo = document.createElement('div');
        destinationInfo.className = 'destination-info';
        columnTitle = document.createElement('p');
        columnTitle.innerHTML = 'Destination';
        destinationInfo.appendChild(columnTitle);
        nodeInfo.appendChild(destinationInfo)

        nextHopInfo = document.createElement('div');
        nextHopInfo.className = 'next-hop-info';
        columnTitle = document.createElement('p');
        columnTitle.innerHTML = 'Next hop';
        nextHopInfo.appendChild(columnTitle);
        nodeInfo.appendChild(nextHopInfo);

        hopCountInfo = document.createElement('div');
        hopCountInfo.className = 'hop-count-info';
        columnTitle = document.createElement('p');
        columnTitle.innerHTML = 'Hop count';
        hopCountInfo.appendChild(columnTitle);
        nodeInfo.appendChild(hopCountInfo);

        seqNoInfo = document.createElement('div');
        seqNoInfo.className = 'seq-no-info';
        columnTitle = document.createElement('p');
        columnTitle.innerHTML = 'Seq. No.';
        seqNoInfo.appendChild(columnTitle);
        nodeInfo.appendChild(seqNoInfo);

        ownInfo = document.createElement('p');
        ownInfo.innerHTML = this.name;
        destinationInfo.appendChild(ownInfo);

		nodeInfoContainer.appendChild(nodeInfo);
		$(this.blockInstance).append(nodeInfoContainer);
	};

	Node.prototype.removeInfo = function() {
		this.blockInstance.innerHTML = '';
	}

    $(document).on( "click", ".block", function() {
        $(this).removeClass('block');
        $(this).addClass('node');

        //var node1 = new Node(this);
        //nodes.push(node1);
        nodes.push(new Node(this));

        if(nodes.length == 2) {
            var x1 = nodes[0].blockInstance.offsetTop;
            var x2 = nodes[1].blockInstance.offsetTop;

            var y1 = nodes[0].blockInstance.offsetLeft;
            var y2 = nodes[1].blockInstance.offsetLeft;

            var distance = Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
        }
    });

    $(document).on( "click", ".node", function() {
        $(this).removeClass('node');
        $(this).addClass('block');

        for (var i = 0; i < nodes.length; i++) {
            if(nodes[i].blockInstance == this) {
                nodes[i].removeInfo();
            }
        }
    });

    setInterval(function () {
        for (var i = 0; i < nodes.length; i++) {
            for (var j = 0; j < nodes.length; j++) {
                if (nodes[i] != nodes[j]) {
                    var x1 = nodes[i].blockInstance.offsetTop;
                    var x2 = nodes[j].blockInstance.offsetTop;

                    var y1 = nodes[i].blockInstance.offsetLeft;
                    var y2 = nodes[j].blockInstance.offsetLeft;

                    var distance = Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));

                    if (distance < 400) {
                        var alreadyIn = false;
                        for (var k = 0; k < nodes[j].table.length; k++) {
                            if (nodes[j].table[k].destination == nodes[i].name) {
                                alreadyIn = true;
                            }
                        }
                        if (alreadyIn) {
                            
                        } else {
                            nodes[j].table.push({destination: nodes[i].name, nextHop: 0, hopCount: 0, seqNo: 0})
                            var infoBlock = nodes[j].blockInstance.getElementsByClassName('destination-info');
                            newInfo = document.createElement('p');
                            newInfo.innerHTML = nodes[i].table[0].destination;
                            infoBlock[0].appendChild(newInfo);
                        }
                    }
                }
            }
        }
    }, 1000);
});