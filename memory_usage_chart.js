var chart;
var scrollB;
var scrollF;
var updateDataPoints;
var maxDatapointNumber = 10;
var minimumXIndex = 1;
var dataUpdateInterval = 500;
var scrollable = false;

var checkTime = ['x',];
var byte_code_bytes = ['byte_code_bytes',];
var string_bytes = ['string_bytes',];
var property_bytes = ['property_bytes',];
var object_bytes = ['object_bytes',];
var allocated_bytes = ['allocated_bytes',];

function initChart(parent, numOfChild)
{
	var chartContainer = document.createElement('div');
	chartContainer.id = 'chart';
	document.getElementsByTagName(parent)[numOfChild].appendChild(chartContainer);
	document.getElementById("chart").addEventListener("mousewheel", MouseWheelHandler);
	document.getElementById("chart").addEventListener("DOMMouseScroll", MouseWheelHandler);

	chart = c3.generate({
		data: {
			x: 'x',
			bindto: '#chart',
			transition: {
				duration: 0
			},
			columns: [
					checkTime,
					byte_code_bytes,
					string_bytes,
					property_bytes,
					object_bytes,
					allocated_bytes
			],
			types: {
					byte_code_bytes: 'area-spline',
					string_bytes: 'area-spline',
					property_bytes: 'area-spline',
					object_bytes: 'area-spline',
					allocated_bytes: 'area-spline'
			},
      order: null,
			groups: [['byte_code_bytes', 'string_bytes', 'property_bytes', 'object_bytes', 'allocated_bytes']]

		},
		axis:{
			x: {
				type: 'category',
				tick: {
					culling: false,
					rotate: 10,
				}
			},
			y: {
				tick: {
					format: function (d) { return d + " B"; }
				}
			}
		}
	});
}

function updateminimumXIndex()
{
	minimumXIndex = checkTime.length - (maxDatapointNumber + 1);
	return minimumXIndex;
}

function addNewDataPoints(breakpointInformation = undefined) {
	if(breakpointInformation === undefined)
	{
		checkTime.push(new Date().toISOString().slice(11, 23));
	}
	else if(checkTime.indexOf(breakpointInformation) === -1)
	{
			checkTime.push(breakpointInformation);
	}
	else
	{
		return;
	}

	/*TODO get data from*/
	var data = [1,2,3,4,5];

	byte_code_bytes.push(data[0]);
	string_bytes.push(data[1]);
	property_bytes.push(data[2]);
	object_bytes.push(data[3]);
	allocated_bytes.push(data[4]);

	if(checkTime.length <= maxDatapointNumber + 1)
	{
		chart.load({
			columns: [
					checkTime,
					byte_code_bytes,
					string_bytes,
					property_bytes,
					object_bytes,
					allocated_bytes
			]
		});
	}
	else
	{
		minimumXIndex++;
		updateScrolledChart();
	}
}

function stopUpdateDataPoints()
{
	clearInterval(updateDataPoints);
	scrollable = true;
}

function startUpdateDataPoints()
{
	stopUpdateDataPoints();
	updateDataPoints = setInterval(addNewDataPoints, dataUpdateInterval);
	scrollable = false;
}

function MouseWheelHandler(e)
{
	e.wheelDelta > 0 ? scrollForward() : scrollBack();
}

function scrollBack()
{
	if(checkTime.length >= maxDatapointNumber + 1 && minimumXIndex > 1 && scrollable === true)
	{
		minimumXIndex --;
		updateScrolledChart();
	}
}

function scrollForward()
{
	if(checkTime.length > maxDatapointNumber + minimumXIndex && scrollable === true)
	{
		minimumXIndex ++;
		updateScrolledChart();
	}
}

function updateScrolledChart()
{
	chart.load({
		columns: [
				[checkTime[0]].concat(checkTime.slice(minimumXIndex, maxDatapointNumber + minimumXIndex)),
				[byte_code_bytes[0]].concat(byte_code_bytes.slice( minimumXIndex, maxDatapointNumber + minimumXIndex)),
				[string_bytes[0]].concat(string_bytes.slice( minimumXIndex, maxDatapointNumber + minimumXIndex)),
				[property_bytes[0]].concat(property_bytes.slice( minimumXIndex, maxDatapointNumber + minimumXIndex)),
				[object_bytes[0]].concat(object_bytes.slice( minimumXIndex, maxDatapointNumber + minimumXIndex)),
				[allocated_bytes[0]].concat(allocated_bytes.slice(minimumXIndex, maxDatapointNumber + minimumXIndex))
		]
	});
}
