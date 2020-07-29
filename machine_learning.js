/* ML functions */
	
/* Linear Regression */
// Y = XA + E
// solving for A: A = (X^T X)^(-1) X^T Y
// Make sure cases where pseudo-inverse won't work are accounted for
// when inputs are identical, should return a line with slope zero
function linearRegression() {
    document.getElementById("result").innerHTML = "Step-by-step explanation using plotted datapoints coming soon!";
    resetVariables()
    
    // break array of datapoints into separate arrays corresponding to their color and variable
    breakIntoSeparateArrays(arrayForMatrix)
    
    // if data for a color exists, build its regression line
    if (isGreen) {
        var color = "green"
        buildLine(arrayGreenX, arrayGreenY, color)
    }
    
    if (isRed) {
        var color = "red"
        buildLine(arrayRedX, arrayRedY, color)
    }
    
    // linear regression functions
    function buildLine( arrayX, arrayY, color ) {
        
        // test physical-to-logical coordinates for arrays
        var logicalArrayX = arrayXPhysicalToLogicalCoordSys(arrayX)
        var logicalArrayY = arrayYPhysicalToLogicalCoordSys(arrayY)
        
        
        // build physical matrices
        var MatrixX = createMatrixX(arrayX);
        var MatrixY = createMatrixY(arrayY);
        
        
        // build logical matrices
        var logicalMatrixX = createMatrixX(logicalArrayX);
        var logicalMatrixY = createMatrixY(logicalArrayY);
        
        var A = createMatrixA(logicalMatrixX, logicalMatrixY)
        var minLogX = getMinLogX()
        var maxLogX = getMaxLogX()
        var minLogY = getMinLogY()
        var maxLogY = getMaxLogY()
        

            // logical 
            var m = A[[1,0]]
            if (isNaN(m)) {
                m = 0
            }
            
            var b = A[[0,0]]
            if (isNaN(b)) {
                var addedRowsMatrixX = logicalMatrixY.transpose().multiply(Matrix_ones_vector(logicalMatrixY))
                b = addedRowsMatrixX[[0,0]]/logicalMatrixY.length
            }
            // create line
            var xStep = (getMaxLogX() - getMinLogX())/canvas_width
            var first = true
            var c = document.getElementById("canvas")
            var ctx = c.getContext("2d")
            ctx.beginPath()
            ctx.strokeStyle = color
            for (var x = getMinLogX(); x <= getMaxLogX(); x+= xStep) {
                var y = linearFunction(x, m, b)
                if (first) {
                    ctx.moveTo(getPhysX(x), getPhysY(y))
                    first = false
                }
                else {
                    ctx.lineTo(getPhysX(x), getPhysY(y))
                }
            }
            ctx.stroke()
        
        function linearFunction( x, m, b ) {
            return m *x + b
        }
    }
    
    // all x entries are the same and at least one y entry is different
    function isInfSlope( arrayX, arrayY, infSlope ) {
        var xEntriesTheSame = true
        var yEntriesTheSame = true
        for (var i = 1; i < arrayX.length; i++) {
            // using floor to undo changed input for accommodating non-invertibles
            if (Math.floor(arrayX[0]) != Math.floor(arrayX[i])) {
                xEntriesTheSame = false
            }
            if (Math.floor(arrayY[0]) != Math.floor(arrayY[i])) {
                yEntriesTheSame = false
            }
        }
        
        if (xEntriesTheSame && yEntriesTheSame == false) {
            infSlope = true
        }
        return infSlope
    }
    
    function createMatrixX( arrayX ) {
        var X = new Matrix(arrayX.length, 1, arrayX);
        X = X.insert_columns(0, 1);
        
        return X;
    }
    
    function createMatrixY( arrayY ) {
        var Y = new Matrix(arrayY.length, 1, arrayY);
        
        return Y;
    }
    
    // find matrix A, a 2x1 made up of b (A[[0,0]]) and m (A[[1,0]])
    // A = (X^T X)^-1 X^T Y
    function createMatrixA( MatrixX, MatrixY ) {
        var XTXinverse = Matrix_inverse(MatrixX.transpose().multiply(MatrixX))
        var XTY        = MatrixX.transpose().multiply(MatrixY)
        var A = XTXinverse.multiply(XTY)
        
        return A
    }
}

function kernelRegression() {
    document.getElementById("result").innerHTML = "Step-by-step explanation using plotted datapoints with polynomial input selection coming soon!";
    var polynomialDegree = 3
    RegressionWithDegree(polynomialDegree)
    
    function RegressionWithDegree( polynomialDegree ) {
        
        resetVariables()

        // break array of datapoints into separate arrays corresponding to their color and variable
        breakIntoSeparateArrays(arrayForMatrix)

        // if data for a color exists, build its regression line
        if (isGreen) {
            var color = "green"
            
            /* The "Over-fitter" */
            // test polynomial degree being set based on number of data points
            //polynomialDegree = arrayGreenX.length - 1
            //buildRegressionLine(arrayGreenX, arrayGreenY, color, polynomialDegree)
            
            /* The Best Fit */
            // fit to a line for 2 or less datapoints
            if (arrayGreenX.length <= 2) {
                buildRegressionLine(arrayGreenX, arrayGreenY, color, 1)
            } else if (arrayGreenX.length <= 5) {
                buildRegressionLine(arrayGreenX, arrayGreenY, color, 2)
            } else if (arrayGreenX.length <= 10) {
                buildRegressionLine(arrayGreenX, arrayGreenY, color, 3)
            } else {
                buildRegressionLine(arrayGreenX, arrayGreenY, color, 4)
            }
        }

        if (isRed) {
            var color = "red"
            if (arrayRedX.length <= 2) {
                buildRegressionLine(arrayRedX, arrayRedY, color, 1)
            } else if (arrayRedX.length <= 5) {
                buildRegressionLine(arrayRedX, arrayRedY, color, 2)
            } else if (arrayRedX.length <= 10) {
                buildRegressionLine(arrayRedX, arrayRedY, color, 3)
            } else {
                buildRegressionLine(arrayRedX, arrayRedY, color, 4)
            }
        }
        
        // kernel regression functions
        function buildRegressionLine( arrayX, arrayY, color, polynomialDegree ) {

            // test physical-to-logical coordinates for arrays
            var logicalArrayX = arrayXPhysicalToLogicalCoordSys(arrayX)

            var logicalArrayY = arrayYPhysicalToLogicalCoordSys(arrayY)

            // build physical matrices
            var MatrixX = createMatrixX(arrayX);
            var MatrixY = createMatrixY(arrayY);

            // build logical matrices
            var logicalMatrixX = createMatrixX(logicalArrayX, polynomialDegree);
            var logicalMatrixY = createMatrixY(logicalArrayY);
            
            
            var A = createMatrixA(logicalMatrixX, logicalMatrixY)
            var minLogX = getMinLogX()
            var maxLogX = getMaxLogX()
            var minLogY = getMinLogY()
            var maxLogY = getMaxLogY()
            
            
            // create line
            var xStep = (getMaxLogX() - getMinLogX())/canvas_width
            var first = true
            var c = document.getElementById("canvas")
            var ctx = c.getContext("2d")
            ctx.beginPath()
            ctx.strokeStyle = color
            for (var x = getMinLogX(); x <= getMaxLogX(); x+= xStep) {
                var y = polynomialFunction(x, A)
                if (first) {
                    ctx.moveTo(getPhysX(x), getPhysY(y))
                    first = false
                }
                else {
                    ctx.lineTo(getPhysX(x), getPhysY(y))
                }
            }
            ctx.stroke()

            function polynomialFunction( x, A ) {
                var polynomialF = 0
                for (var i = 0; i < A.length; i++) {
                    
                    //if (A.length == 1 && )
                    if (i == 0 && isNaN(A[[0,0]])) {
                        // b equals the average of y array inputs
                        var addedRowsMatrixY = logicalMatrixY.transpose().multiply(Matrix_ones_vector(logicalMatrixY))
                        A[[0,0]] = addedRowsMatrixY[[0,0]]/logicalMatrixY.length
                    }
                    if (i >= 1 && isNaN(A[[i,0]])) {
                        A[[i,0]] = 0
                    }
                    
                    polynomialF += ((x **(i)) * A[[i,0]])
                }
                // returns a_0 + x*a_1 + x^2*a_2 + ... x^n*a_n 
                return polynomialF
            }
        }

        // all x entries are the same and at least one y entry is different
        function isInfSlope( arrayX, arrayY, infSlope ) {
            var xEntriesTheSame = true
            var yEntriesTheSame = true
            for (var i = 1; i < arrayX.length; i++) {
                // using floor to undo changed input for accommodating non-invertibles
                if (Math.floor(arrayX[0]) != Math.floor(arrayX[i])) {
                    xEntriesTheSame = false
                }
                if (Math.floor(arrayY[0]) != Math.floor(arrayY[i])) {
                    yEntriesTheSame = false
                }
            }

            if (xEntriesTheSame && yEntriesTheSame == false) {
                infSlope = true
            }
            return infSlope
        }

        // [1, x, x^2, ..., x^n]
        // would need to feed in the degree of the polynomial
        function createMatrixX( arrayX, polynomialDegree ) {
            var X = new Matrix(arrayX.length, 1, arrayX);
            var polynomialArray
            for (var i = 1; i < polynomialDegree; i++) {
                polynomialArray =  arrayX.map(x => x **(i+1))
                X = X.insert_columns(X.numColumns, polynomialArray)
                //pop inserted column
            }
            X = X.insert_columns(0, 1);
            
            return X;
        }

        function createMatrixY( arrayY ) {
            var Y = new Matrix(arrayY.length, 1, arrayY);

            return Y;
        }

        // find matrix A, a 2x1 made up of b (A[[0,0]]) and m (A[[1,0]])
        // A = (X^T X)^-1 X^T Y
        function createMatrixA( MatrixX, MatrixY ) {
            var XTXinverse = Matrix_inverse(MatrixX.transpose().multiply(MatrixX))
            var XTY        = MatrixX.transpose().multiply(MatrixY)
            var A = XTXinverse.multiply(XTY)

            return A
        }
    }
}

function kNearest() {
    document.getElementById("result").innerHTML = "Under construction! Please try again soon!";
    var newMatrix = new Matrix(arrayForMatrix.length/3, 3, arrayForMatrix);
}

function kMeans() {
    document.getElementById("result").innerHTML = "Under construction! Please try again soon!";
    var newMatrix = new Matrix(arrayForMatrix.length/3, 3, arrayForMatrix);
}

function decisionTrees() {
    document.getElementById("result").innerHTML = "Under construction! Please try again soon!";
    var newMatrix = new Matrix(arrayForMatrix.length/3, 3, arrayForMatrix);
}

function randomForest() {
    document.getElementById("result").innerHTML = "Under construction! Please try again soon!";
    var newMatrix = new Matrix(arrayForMatrix.length/3, 3, arrayForMatrix);
}

function standardSVM() {
    document.getElementById("result").innerHTML = "Under construction! Please try again soon!";
    var newMatrix = new Matrix(arrayForMatrix.length/3, 3, arrayForMatrix);
}

function multiSVM() {
    document.getElementById("result").innerHTML = "Under construction! Please try again soon!";
    var newMatrix = new Matrix(arrayForMatrix.length/3, 3, arrayForMatrix);
}

function neuralNetwork() {
    document.getElementById("result").innerHTML = "Under construction! Please try again soon!";
    var newMatrix = new Matrix(arrayForMatrix.length/3, 3, arrayForMatrix);
}

function logisticRegression() {
    document.getElementById("result").innerHTML = "Under construction! Please try again soon!";
    var newMatrix = new Matrix(arrayForMatrix.length/3, 3, arrayForMatrix);
}

function naiveBayes() {
    document.getElementById("result").innerHTML = "Under construction! Please try again soon!";
    var newMatrix = new Matrix(arrayForMatrix.length/3, 3, arrayForMatrix);
}

function gaussianMixtureModel() {
    document.getElementById("result").innerHTML = "Under construction! Please try again soon!";
    var newMatrix = new Matrix(arrayForMatrix.length/3, 3, arrayForMatrix);
}

// functions used by multiple ML functions
function resetVariables() {
    isGreen = false;
    arrayGreenX = new Array();
    arrayGreenY = new Array();
    
    isRed = false;
    arrayRedX = new Array();
    arrayRedY = new Array();
}

function breakIntoSeparateArrays( arrayForMatrix ) {
    for (var i = 2; i < arrayForMatrix.length; i+=3) {
        if (arrayForMatrix[i] == 0) {
            isGreen = true;
            arrayGreenX.push(arrayForMatrix[i -2]);
            arrayGreenY.push(arrayForMatrix[i -1]);
        }
        if (arrayForMatrix[i] == 1) {
            isRed = true;
            arrayRedX.push(arrayForMatrix[i -2]);
            arrayRedY.push(arrayForMatrix[i -1]);
        } 
    }
}

function breakIntoSeparateArrays( arrayForMatrix ) {
    for (var i = 2; i < arrayForMatrix.length; i+=3) {
        if (arrayForMatrix[i] == 0) {
            isGreen = true;
            arrayGreenX.push(arrayForMatrix[i -2]);
            arrayGreenY.push(arrayForMatrix[i -1]);
        }
        if (arrayForMatrix[i] == 1) {
            isRed = true;
            arrayRedX.push(arrayForMatrix[i -2]);
            arrayRedY.push(arrayForMatrix[i -1]);
        } 
    }
}



//$(window).ready(load)