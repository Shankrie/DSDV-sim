$(document).ready(function() {
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

    $("#header").css({
        'width' : '98.9%'
    })

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
        columnTitle.innerHTML = 'Seq';
        seqNoInfo.appendChild(columnTitle);
        nodeInfo.appendChild(seqNoInfo);

        ownInfo = document.createElement('p');
        ownInfo.innerHTML = this.name;
        destinationInfo.appendChild(ownInfo);

        ownInfo = document.createElement('p');
        ownInfo.className = 'next-hop-row';
        ownInfo.innerHTML = this.name;
        nextHopInfo.appendChild(ownInfo);

        ownInfo = document.createElement('p');
        ownInfo.className = 'hop-count-row';
        ownInfo.innerHTML = '0';
        hopCountInfo.appendChild(ownInfo);

        ownInfo = document.createElement('p');
        ownInfo.className = 'seq-no-row';
        ownInfo.innerHTML = this.name + '-0';
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
        this.style.backgroundColor = 'white';

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
        this.style.backgroundColor = '#313131';

        for (var i = 0; i < nodes.length; i++) {
            if(nodes[i].blockInstance == this) {
                nodes[i].removeInfo();
                nodes[i].blockInstance.style.backgroundColor = '#313131';
                //nodes.splice(i, 1);

                break;
            }
        }
    });

    $('#route-search').click(function(e) {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].blockInstance.style.backgroundColor = 'white';
        }

        var formElements = $('form').serializeArray();
        var from, to;
        for (var i = 0; i < formElements.length; i++) {
            if (formElements[i].name == "from") {
                from = parseInt(formElements[i].value);
            }
            if (formElements[i].name == "to") {
                to = parseInt(formElements[i].value);
            }
        }

        var i = from;
        var nodeToCheck;
        while (i != to) {
            for (var j = 0; j < nodes.length; j++) {
                if (nodes[j].name == i) {
                    nodeToCheck = nodes[j];
                }
            }
            for (var j = 0; j < nodeToCheck.table.length; j++) {
                if (nodeToCheck.table[j].destination == to) {
                    i = nodeToCheck.table[j].nextHop;
                    nodeToCheck.blockInstance.style.backgroundColor = '#2495AF';
                }
            }
        }
        for (var j = 0; j < nodes.length; j++) {
            if (nodes[j].name == i) {
                nodeToCheck = nodes[j];
                nodeToCheck.blockInstance.style.backgroundColor = '#2495AF';
            }
        }

    });

    setInterval(function () {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].table[0].seqNo += 2;
            for (var j = 0; j < nodes.length; j++) {
                if (nodes[i] != nodes[j]) {
                    var x1 = nodes[i].blockInstance.offsetTop;
                    var x2 = nodes[j].blockInstance.offsetTop;

                    var y1 = nodes[i].blockInstance.offsetLeft;
                    var y2 = nodes[j].blockInstance.offsetLeft;

                    var distance = Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));

                    if (distance < 400) {
                        var k, l;
                        for (k = 0; k < nodes[i].table.length; k++) {
                            var alreadyIn = false;
                            var needsUpdating = false;
                            for (l = 0; l < nodes[j].table.length; l++) {
                                if (nodes[i].table[k].destination == nodes[j].table[l].destination) {
                                    alreadyIn = true;
                                    if (nodes[i].table[k].seqNo > nodes[j].table[l].seqNo) {
                                        needsUpdating = true;
                                    }
                                    break;
                                }
                                if (nodes[i].name == 1 && nodes[i].table[k].destination == 2 && nodes[j].name == 0) {
                                    //alert(nodes[j].table[l].destination);
                                }
                            }

                            var destination = nodes[i].table[k].destination;
                            var nextHop = nodes[i].name;
                            var hopCount = nodes[i].table[k].hopCount + 1;
                            var seqNo = nodes[i].table[k].seqNo;

                            var column, row, newInfo;

                            if (alreadyIn) {
                                if (needsUpdating) {

                                    seqNo = nodes[i].table[k].seqNo;

                                    column = nodes[i].blockInstance.getElementsByClassName('seq-no-row');
                                    column[0].innerHTML = nextHop + '-' + seqNo;

                                    nodes[j].table[l].nextHop = nextHop;
                                    nodes[j].table[l].hopCount = hopCount;
                                    nodes[j].table[l].seqNo = seqNo;

                                    row = nodes[j].blockInstance.getElementsByClassName('next-hop-row');
                                    row[l].innerHTML = nextHop;

                                    row = nodes[j].blockInstance.getElementsByClassName('hop-count-row');
                                    row[l].innerHTML = hopCount;

                                    row = nodes[j].blockInstance.getElementsByClassName('seq-no-row');
                                    row[l].innerHTML = destination + '-' +seqNo;
                                }
                            } else {


                                seqNo = nodes[i].table[k].seqNo;

                                column = nodes[i].blockInstance.getElementsByClassName('seq-no-row');
                                column[0].innerHTML = nextHop + '-' + seqNo;

                                nodes[j].table.push({
                                    destination: destination,
                                    nextHop: nextHop,
                                    hopCount: hopCount,
                                    seqNo: seqNo
                                })

                                column = nodes[j].blockInstance.getElementsByClassName('destination-info');
                                newInfo = document.createElement('p');
                                newInfo.innerHTML = destination;
                                column[0].appendChild(newInfo);

                                column = nodes[j].blockInstance.getElementsByClassName('next-hop-info');
                                newInfo = document.createElement('p');
                                newInfo.innerHTML = nextHop;
                                newInfo.className = 'next-hop-row';
                                column[0].appendChild(newInfo);

                                column = nodes[j].blockInstance.getElementsByClassName('hop-count-info');
                                newInfo = document.createElement('p');
                                newInfo.innerHTML = hopCount;
                                newInfo.className = 'hop-count-row';
                                column[0].appendChild(newInfo);

                                column = nodes[j].blockInstance.getElementsByClassName('seq-no-info');
                                newInfo = document.createElement('p');
                                newInfo.innerHTML = destination + '-' + seqNo;
                                newInfo.className = 'seq-no-row';
                                column[0].appendChild(newInfo);
                            }
                        }
                    }
                }
            }
        }
    }, 1000);
});