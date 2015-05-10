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
        this.table = [{destination: this.name, nextHop: this.name, hopCount: 0, seqNo: 0}];

        nodeInfoContainer = document.createElement('div');
		nodeInfoContainer.className = 'node-info-container';

        nodeInfo = document.createElement('div');
        nodeInfo.className = 'node-info';
        //nodeInfo.innerHTML = '<p>' + 'Destination: ' + this.table[0].destination + ' | Next hop: ' + this.table[0].nextHop + '</p>';

        destinationInfo = document.createElement('div');
        destinationInfo.className = 'destination-info';
        columnTitle = document.createElement('p');
        columnTitle.innerHTML = 'Dest.';
        destinationInfo.appendChild(columnTitle);
        nodeInfo.appendChild(destinationInfo)

        nextHopInfo = document.createElement('div');
        nextHopInfo.className = 'next-hop-info';
        columnTitle = document.createElement('p');
        columnTitle.innerHTML = 'Next';
        nextHopInfo.appendChild(columnTitle);
        nodeInfo.appendChild(nextHopInfo);

        hopCountInfo = document.createElement('div');
        hopCountInfo.className = 'hop-count-info';
        columnTitle = document.createElement('p');
        columnTitle.innerHTML = 'Metric';
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

        ownInfo = document.createElement('p');
        ownInfo.innerHTML = this.name;
        nextHopInfo.appendChild(ownInfo);

        ownInfo = document.createElement('p');
        ownInfo.innerHTML = '0';
        hopCountInfo.appendChild(ownInfo);

        ownInfo = document.createElement('p');
        ownInfo.innerHTML = this.name + '-0';
        ownInfo.className = 'seq-no';
        seqNoInfo.appendChild(ownInfo);

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

                        for (var k = 0; k < nodes[i].table.length; k++) {
                            var alreadyIn = false;
                            for (var l = 0; l < nodes[j].table.length; l++) {
                                if (nodes[i].table[k].destination == nodes[j].table[l].destination) {
                                    alreadyIn = true;
                                }
                                if (nodes[i].name == 1 && nodes[i].table[k].destination == 2 && nodes[j].name == 0) {
                                    //alert(nodes[j].table[l].destination);
                                }
                            }



                            if (alreadyIn) {

                            } else {
                                nodes[i].table[k].seqNo++;

                                var destination = nodes[i].table[k].destination;
                                var nextHop = nodes[i].name;
                                var hopCount = nodes[i].table[k].hopCount + 1;
                                var seqNo = nodes[i].table[k].seqNo;

                                var column, newInfo;

                                column = nodes[i].blockInstance.getElementsByClassName('seq-no');
                                column[0].innerHTML = destination + '-' + seqNo;

                                nodes[j].table.push({
                                    destination: destination,
                                    nextHop: nextHop,
                                    hopCount: hopCount,
                                    seqNo: seqNo
                                })

                                column = nodes[j].blockInstance.getElementsByClassName('destination-info');
                                newInfo = document.createElement('p');
                                newInfo.innerHTML = destination
                                column[0].appendChild(newInfo);

                                column = nodes[j].blockInstance.getElementsByClassName('next-hop-info');
                                newInfo = document.createElement('p');
                                newInfo.innerHTML = nextHop;
                                column[0].appendChild(newInfo);

                                column = nodes[j].blockInstance.getElementsByClassName('hop-count-info');
                                newInfo = document.createElement('p');
                                newInfo.innerHTML = hopCount;
                                column[0].appendChild(newInfo);

                                column = nodes[j].blockInstance.getElementsByClassName('seq-no-info');
                                newInfo = document.createElement('p');
                                newInfo.innerHTML = seqNo;
                                newInfo.className = 'seq-no';
                                column[0].appendChild(newInfo);
                            }
                        }
                    }
                }
            }
        }
    }, 1000);
});