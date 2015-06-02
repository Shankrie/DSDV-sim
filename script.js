$(document).ready(function() {
	var reach = 250;
    var destinationColumnClassName = 'destination-info';
    var nextHopColumnClassName = 'next-hop-info';
    var hopCountColumnClassName = 'hop-count-info';
    var seqNoColumnClassName = 'seq-no-info';

    var destinationRowClassName = 'destination-row';
    var nextHopRowClassName = 'next-hop-row';
    var hopCountRowClassName = 'hop-count-row';
    var seqNoRowClassName = 'seq-no-row';

    var destinationColumnTitle = 'Dest.';
    var nextHopColumnTitle = 'Next';
    var hopCountColumnTitle = 'Metric';
    var seqNoColumnTitle = 'Seq.';

    var width = $(window).width();
	var height = $(window).height();
	var blockSize = $("#header").width();

	var blocksHor = Math.floor(width / blockSize);
	var blocksVer = Math.floor(height / blockSize);

    $('body').css({
        'width': width,
        'height': height
    });

	width = width - (blocksHor * 2);
	blocksHor = Math.floor(width / blockSize);
	
	height = height - (blocksVer * 2) - blockSize;
	blocksVer = Math.floor(height / blockSize);
	
	var blocksNeeded = blocksHor * blocksVer;

    $("#header").css({
        'width' : 'calc(100% - 2px)'
    })

	for (var i = 0; i < blocksNeeded; i++) {
		$("body").append('<div class="block"></div>');
	}

    var nodes = [];

	// Create Node class
	var Node = function(block) {
        this.blockInstance = block;
        this.name = nodes.length;
        this.table = [{destination: this.name, nextHop: this.name, hopCount: 0, seqNo: 0}];
        this.active = true;

        var nodeInfoContainer = document.createElement('div');
        nodeInfoContainer.className = 'node-info-container';

        var circle = document.createElement('img');
        circle.src = 'circle.svg';
        circle.className = 'circle';

        nodeInfo = document.createElement('div');
        nodeInfo.className = 'node-info';

        appendColumn(destinationColumnClassName, destinationRowClassName, destinationColumnTitle, this.name, nodeInfo);
        appendColumn(nextHopColumnClassName, nextHopRowClassName, nextHopColumnTitle, this.name, nodeInfo);
        appendColumn(hopCountColumnClassName, hopCountRowClassName, hopCountColumnTitle, '0', nodeInfo);
        appendColumn(seqNoColumnClassName, seqNoRowClassName, seqNoColumnTitle, this.name + '-0', nodeInfo);

        nodeInfoContainer.appendChild(circle);
		nodeInfoContainer.appendChild(nodeInfo);
		$(this.blockInstance).append(nodeInfoContainer);

        $(circle).fadeOut(1500, function() {});

        var _this = this;
        setInterval(function() {
            if (_this.active) {
                _this.table[0].seqNo += 2;
                updateInfo(_this, _this.name + '-' + _this.table[0].seqNo, 0, seqNoRowClassName);
                for (var j = 0; j < nodes.length; j++) {
                    if (_this != nodes[j] && nodes[j].active) {
                        if (areClose(_this, nodes[j])) {
                            var k, l;
                            var isActive = true;
                            for (k = 0; k < _this.table.length; k++) {
                                var alreadyIn = false;
                                var needsUpdating = false;

                                for (l = 0; l < nodes[j].table.length; l++) {
                                    if (_this.table[k].hopCount == -1) {
                                        isActive = false;
                                    }
                                    else if (_this.table[k].destination == nodes[j].table[l].destination) {
                                        alreadyIn = true;
                                        if (_this.table[k].seqNo > nodes[j].table[l].seqNo) {
                                            needsUpdating = true;
                                        }
                                        break;
                                    }
                                }

                                var destination = _this.table[k].destination;
                                var nextHop = _this.name;
                                var hopCount = _this.table[k].hopCount + 1;
                                var seqNo = _this.table[k].seqNo;

                                if (hopCount == 0) {
                                    hopCount = -1;
                                }

                                if (alreadyIn) {
                                    if (needsUpdating) {

                                        //seqNo = _this.table[k].seqNo;
                                        //
                                        ////updates own sequence number info
                                        //updateInfo(_this, nextHop + '-' + seqNo, 0, seqNoRowClassName);

                                        nodes[j].table[l].nextHop = nextHop;
                                        nodes[j].table[l].hopCount = hopCount;
                                        nodes[j].table[l].seqNo = seqNo;

                                        updateInfo(nodes[j], nextHop, l, nextHopRowClassName);
                                        updateInfo(nodes[j], hopCount, l, hopCountRowClassName);
                                        updateInfo(nodes[j], destination + '-' + seqNo, l, seqNoRowClassName);
                                    }
                                } else if (isActive) {
                                    nodes[j].table.push({
                                        destination: destination,
                                        nextHop: nextHop,
                                        hopCount: hopCount,
                                        seqNo: seqNo
                                    });

                                    appendInfo(nodes[j], destination, destinationColumnClassName, destinationRowClassName);
                                    appendInfo(nodes[j], nextHop, nextHopColumnClassName, nextHopRowClassName);
                                    appendInfo(nodes[j], hopCount, hopCountColumnClassName, hopCountRowClassName);
                                    appendInfo(nodes[j], destination + '-' + seqNo, seqNoColumnClassName, seqNoRowClassName);
                                }
                            }
                        }
                    }
                }
                //$(circle).fadeIn(1, function() {});
                //$(circle).fadeOut(500, function() {});
            }
        }, 4000);
	};

    function appendColumn(columnClassName, rowClassName, columnTitle, ownInfo, container) {
        var column, title, info;
        column = document.createElement('div');
        column.className = columnClassName;
        title = document.createElement('p');
        title.innerHTML = columnTitle;
        column.appendChild(title);

        info = document.createElement('p');
        info.className = rowClassName;
        info.innerHTML = ownInfo;
        column.appendChild(info);

        container.appendChild(column);
    }

	Node.prototype.removeInfo = function() {
		this.blockInstance.innerHTML = '';
	}

    $(document).on( "click", ".block", function() {
        $(this).removeClass('block');
        $(this).addClass('node');

        nodes.push(new Node(this));
        adNewNode(nodes[nodes.length-1], nodes.length-1);

    });

    $(document).on( "click", ".node", function() {
        if (event.target.className == 'node') {

            $(this).removeClass('node');
            $(this).addClass('block');
            this.style.backgroundColor = '#313131';

            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].blockInstance == this) {
                    nodes[i].active = false;
                    nodes[i].removeInfo();
                    nodes[i].blockInstance.style.backgroundColor = '#313131';

                    immediateAd(nodes[i], i);

                    break;
                }
            }
        }
    });

    //immediate advertising after removing node
    function immediateAd(node, initialNodeIndex) {
        for (var i = 0; i < nodes.length; i++) {
            if (node != nodes[i] && i != initialNodeIndex && nodes[i].active) {
                var alreadyUpdated = false;

                if (areClose(node, nodes[i])) {
                    for (var j = 0; j < nodes[i].table.length; j++) {
                        if (nodes[i].table[j].destination == initialNodeIndex) {
                            if (nodes[i].table[j].hopCount < 0) {
                                alreadyUpdated = true;
                            } else {
                                nodes[i].table[j].hopCount = -1;
                                nodes[i].table[j].seqNo = nodes[initialNodeIndex].table[0].seqNo + 1;

                                updateInfo(nodes[i], -1, j, hopCountRowClassName);
                                updateInfo(nodes[i], initialNodeIndex + '-' + nodes[i].table[j].seqNo, j, seqNoRowClassName);

                                immediateAd(nodes[i], initialNodeIndex);
                            }
                        }
                    }
                }
            }
        }
    }

    //immediate advertising after adding new node
    function adNewNode(node, initialNodeIndex) {
        node.table[0].seqNo += 2;
        updateInfo(node, node.name + '-' + node.table[0].seqNo, 0, seqNoRowClassName);
        for (var i = 0; i < nodes.length; i++) {
            //alert(node.name + ' - ' + nodes[i].name);
            if (node != nodes[i] && nodes[i].active) {
                var alreadyUpdated = false;

                if (areClose(node, nodes[i])) {
                    var j, k;
                    for (j = 0; j < node.table.length; j++) {
                        var alreadyIn = false;
                        var needsUpdating = false;
                        for (k = 0; k < nodes[i].table.length; k++) {
                            if (node.table[j].destination == nodes[i].table[k].destination) {
                                alreadyIn = true;
                                if (nodes[i].table[k].destination == initialNodeIndex) {
                                    alreadyUpdated = true;
                                }
                                if (node.table[j].seqNo > nodes[i].table[k].seqNo) {
                                    needsUpdating = true;
                                }
                                break;
                            }
                        }

                        var destination = node.table[j].destination;
                        var nextHop = node.name;
                        var hopCount = node.table[j].hopCount + 1;
                        var seqNo = node.table[j].seqNo;

                        if (hopCount == 0) {
                            hopCount = -1;
                        }

                        if (alreadyIn) {
                            if (needsUpdating) {
                                nodes[i].table[k].nextHop = nextHop;
                                nodes[i].table[k].hopCount = hopCount;
                                nodes[i].table[k].seqNo = seqNo;

                                updateInfo(nodes[i], nextHop, k, nextHopRowClassName);
                                updateInfo(nodes[i], hopCount, k, hopCountRowClassName);
                                updateInfo(nodes[i], destination + '-' + seqNo, k, seqNoRowClassName);
                            }
                        }
                        else {
                            //seqNo = node.table[j].seqNo;
                            //updateInfo(node, nextHop + '-' + seqNo, 0, seqNoRowClassName);

                            nodes[i].table.push({
                                destination: destination,
                                nextHop: nextHop,
                                hopCount: hopCount,
                                seqNo: seqNo
                            });

                            appendInfo(nodes[i], destination, destinationColumnClassName, destinationRowClassName);
                            appendInfo(nodes[i], nextHop, nextHopColumnClassName, nextHopRowClassName);
                            appendInfo(nodes[i], hopCount, hopCountColumnClassName, hopCountRowClassName);
                            appendInfo(nodes[i], destination + '-' + seqNo, seqNoColumnClassName, seqNoRowClassName);
                        }
                    }
                    if (!alreadyUpdated) {
                        adNewNode(nodes[i], initialNodeIndex);
                    }
                }
            }
        }
    }

    function areClose(nodeA, nodeB) {
        var x1 = nodeA.blockInstance.offsetTop + 16;
        var x2 = nodeB.blockInstance.offsetTop + 16;

        var y1 = nodeA.blockInstance.offsetLeft + 16;
        var y2 = nodeB.blockInstance.offsetLeft + 16;

        var distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

        if (distance < reach) {
            return true;
        }
        else {
            return false;
        }
    }

    function appendInfo(node, info, columnClassName, rowClassName) {
        var column, newInfo;
        column = node.blockInstance.getElementsByClassName(columnClassName);
        newInfo = document.createElement('p');
        newInfo.innerHTML = info;
        newInfo.className = rowClassName;
        column[0].appendChild(newInfo);
    }

    function updateInfo(node, info, rowIndex, rowClassName) {
        var row;
        row = node.blockInstance.getElementsByClassName(rowClassName);
        row[rowIndex].innerHTML = info;
    }


    $('#route-search').click(function() {
        clearNodes();

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

        //check if entered nodes exits
        var fromExists = false;
        var toExists = false;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].active && nodes[i].name == from) {
                fromExists = true;
            }
            else if (nodes[i].active && nodes[i].name == to) {
                toExists = true;
            }
        }

        if (!fromExists) {
            alert('Invalid input: node ' + from + ' does not exists or is not active');
        }
        else if (!toExists) {
            alert('Invalid input: node ' + to + ' does not exists or is not active');
        }

        else {
            var i = from;
            var nodeToCheck;
            while (i != to) {
                for (var j = 0; j < nodes.length; j++) {
                    if (nodes[j].name == i) {
                        nodeToCheck = nodes[j];
                    }
                }
                if (!nodeToCheck.active) {
                    alert('Node ' + to + ' is unreachable from node ' + from);
                    clearNodes();
                    break;
                }
                for (var j = 0; j < nodeToCheck.table.length; j++) {
                    if (nodeToCheck.table[j].destination == to) {
                        i = nodeToCheck.table[j].nextHop;
                        nodeToCheck.blockInstance.style.backgroundColor = '#2495AF';
                    }
                }
            }
            for (var j = 0; j < nodes.length; j++) {
                if (nodes[j].name == i && nodes[j].active) {
                    nodeToCheck = nodes[j];
                    nodeToCheck.blockInstance.style.backgroundColor = '#2495AF';
                }
            }
        }
    });

    function clearNodes() {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].active) {
                nodes[i].blockInstance.style.backgroundColor = 'white';
            }
        }
    }
});