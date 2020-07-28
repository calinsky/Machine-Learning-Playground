// row-major matrix class
class Matrix extends Array {
	
	constructor( numRows, numColumns, List ) {
		// by default, create matrix of 0s if List not given
		if (List == undefined) {
			super(numRows * numColumns)
			this.fill(0)
		}
		else {
			// List length needs to be valid multiple of numRows and numColumns
			if (numRows * numColumns != List.length) throw "Invalid matrix dimensions!"
			if (List.length == 1) super(   List)
			else                  super(...List)
		}
		
		this.numRows    = numRows
		this.numColumns = numColumns
		
		this.List = this
		//this.List = List
	}

    toString() {
		function formatElement( element ) {
//			return element.toFixed(2).replace(/[.0](?=0*$)/g, '')
            var negative = false

			const precision = 1e-2
			if (element < 0) {
			    negative = true
			}
			if (negative) {
			    element = element*-1
			    if (element - Math.floor(element) < 0.005 && element - Math.floor(element) > 0) {
			        return "-" + (Math.round(element /precision) *precision).toString() + ".00"
			    }
			    else {
			        return "-" + (Math.round(element /precision) *precision).toString()
			    }
			    
			}
			else {
			    if (element - Math.floor(element) < 0.005 && element - Math.floor(element) > 0) {
			        return (Math.round(element /precision) *precision).toString() + ".00"
			    } 
			    else {
			        // console.log(typeof (Math.round(element /precision) *precision).toString())
			        return (Math.round(element /precision) *precision).toString()
			    }
			}
		}
		function longestElementLength( List ) {
			var maxLength = 0
			for (var i = 0; i < List.length; i++) {
			    // count the elements of the string
				const elementLength = formatElement(List[i]).length
				// console.log("List element i: " + List[i])
				// console.log("Formatted element i: " + formatElement(List[i]))
				// console.log("Element length: " + elementLength)
				if (maxLength < elementLength) {
					maxLength = elementLength
				}
			}
			return maxLength
		}
		// beginning of toString() function
		// console.log(this)
		const maxLength = longestElementLength(this)

		var matrixString = ''
		
		for (var i = 0; i < this.numRows; i++) {
			var rowString = '['
			for (var j = 0; j < this.numColumns; j++) {
				const element = formatElement(this[[i, j]])
				const padding = ' '.repeat(maxLength - element.length)
				rowString += padding + element + ' '
			}
			rowString += ']'

			matrixString += rowString.replace(/ ]/g, "]\n")
		}
		
		
		return matrixString
	}

	_parse_call_type( f, AA, BB ) {
		return (BB == undefined)? f(this, AA):
								  f(  AA, BB)
	}
	
	// add a given Matrix with the current one and return a new resulting Matrix
	add( AA, BB ) {
		// allows add method to be called following ways: AA.add(BB),  Matrix.add(AA, BB)
		
//		return Matrix._parse_call_type(Matrix_add, AA, BB)
		return (BB == undefined)? Matrix_add(this, AA):
								  Matrix_add(  AA, BB)
	}

	// add a given Matrix to the current one and return this current, but updated, Matrix ("in place" method (means it will update itself))
	add_( AA ) {
		if (this.numRows != AA.numRows || this.numColumns != AA.numColumns) throw "Mismatched matrix dimensions!"
		for (var i = 0; i < this.length; i++) this[i] += AA[i]
		return this
	}

	determinant() {
		
		return Matrix_determinant(this)
	}
	
	// ********** unfinished method
	eigenvalues( AA ) {
		
		return Matrix_eigenvalues(this)
	}
	
	// returns new identity Matrix with same (square) dimensions as given matrix
	Identity( AA ) {
		return (AA == undefined)? Matrix_identity(this):
								  Matrix_identity( AA )
	}
	
	insert_columns( column_place, Column ) {
		
		return Matrix_insert_columns(this, column_place, Column)
	}
	
	insert_rows( row_place, Row ) {
		return Matrix_insert_rows(this, row_place, Row)
	}
	
	// return a new Matrix that is the inverse of given Matrix
	inverse() {
		
		return Matrix_inverse(this)
	}
	
	// converts AA.List[index] to AA_i,j subscripts
	index_to_sub( index ) {
		if (index < 0 || index >= this.length) throw "Index is out of range"
		
		// if reading row-major order
		const i = Math.floor(index/this.numColumns)
		const j = index - this.numColumns*i
		
		// if reading column-major order 
		// const i = index % this.numRows
		// const j = Math.floor(index / this.numRows)
		
		// Object containing subscripts
		return [i, j]//{ i: i, j: j }
	}
	
	multiply( AA ) {
		
		return Matrix_multiply( this, AA )
	}
	
	// returns a vector of ones of the same length as this.numRows
	ones_vector() {
	    
	    return Matrix_ones_vector( this )
	}
	
	
	// converts AA_i,j subscripts to the corresponding List index: AA.List[index]
	sub_to_index( i, j ) {
		if (i < 0 || i >= this.numRows   ) throw "Subscript i is out of range"
		if (j < 0 || j >= this.numColumns) throw "Subscript j is out of range"
		
		// if reading row/major order (like spoken, used in numpy and torch)
		return j + i *this.numColumns
		
		// reading column/major order (use in MATLAB)
		// return i + j *this.numRows
	}
	
	// returns new matrix with swapped columns (used in upper-triangular)
	swap_columns( column_a_index, column_b_index ) {
		
		return Matrix_swap_columns(this, column_a_index, column_b_index)
	}
	
	// returns same matrix with swapped columns (used in upper-triangular)
	swap_columns_( column_a_index, column_b_index ) {
		if (column_a_index < 0 || column_a_index >= this.numColumns) throw "Invalid index for column \'a\'"
		if (column_b_index < 0 || column_b_index >= this.numColumns) throw "Invalid index for column \'b\'"

		for (var i = 0; i < this.numRows; i++) {
			var a_entry_copy = this[[i, column_a_index]]
			// replace a with b
			this[[i, column_a_index]] = this[[i, column_b_index]]
			//replace b with a
			this[[i, column_b_index]] = a_entry_copy

		}

		return this
	}
	
	// returns new matrix with rows a and b swapped
	swap_rows( row_a_index, row_b_index ) {
		
		return Matrix_swap_rows(this, row_a_index, row_b_index)
	}

	// returns same matrix with rows a and b swapped (used in upper-triangular)
	swap_rows_( row_a_index, row_b_index ) {
		if (row_a_index < 0 || row_a_index >= this.numRows) throw "Invalid index for row \'a\'"
		if (row_b_index < 0 || row_b_index >= this.numRows) throw "Invalid index for row \'b\'"

		for (var i = 0; i < this.numColumns; i++) {
			var a_entry_copy = this[[row_a_index, i]]
			// replace a with b
			this[[row_a_index, i]] = this[[row_b_index, i]]
			//replace b with a
			this[[row_b_index, i]] = a_entry_copy

		}

		return this
	}
	
	// return a new Matrix equivalent to AA^T
	transpose() {

		return Matrix_transpose(this)
	}
	
	transpose_() {
		
		// would ideally transpose itself without wasting extra memory, using a stored swap variable
		
		var AA_copy = Matrix_transpose(this)

		for (var i = 0; i < this.length; i++) {
			this[i] = AA_copy[i]
		}

		this.numRows    = AA_copy.numRows
		this.numColumns = AA_copy.numColumns
		
		return this
	}
	
}

(function() {
  const _Matrix = Matrix
  Matrix = new Proxy(_Matrix, {
    construct: function( obj, args ) {
      const M = new _Matrix(...args)
    
      function toIndex( key ) {
        const subs = key.split(',').map((i) => Number(i))
        return M.sub_to_index(...subs)
      }
      
      return new Proxy(M, {
        get: function( obj, key      ) { if (typeof(key) == "symbol") return Matrix.prototype.toPrimitive
										 return obj[(key in obj)? key : toIndex(key)] },
        set: function( obj, key, val ) { obj[(key in obj)? key : toIndex(key)] = val; return true }
      })
    }
  })
})()

/* -------- STATIC FUNCTIONS -------- */
// add two Matrices and return a new resulting Matrix (STATIC FUNCTION)
function Matrix_add( AA, BB ) {
	if (AA.numRows != BB.numRows || AA.numColumns != BB.numColumns) throw "Mismatched matrix dimensions!"

	var NewMatrix = new Matrix(AA.numRows, AA.numColumns)
	for (var i = 0; i < NewMatrix.length; i++) NewMatrix[i] = AA[i] + BB[i]

	return NewMatrix
}

function Matrix_determinant( AA ) {

	if (AA.numRows != AA.numColumns) throw "Matrix dimensions must be n x n"

	const AA_upper = Matrix_upper_triangular(AA)
	
	// multiply diagonals together
	var determinant = 1
	for (var i = 0; i < AA_upper.numColumns; i++) {
		determinant *= AA_upper[[i,i]]
	}

	// update sign from upper-triangular computation
	determinant *= AA_upper.determinantMultiplier
	
	const precision = 1e-2
	
	return Math.round(determinant/precision)*precision
}

// return the eigenvalues of a given matrix
// ********** unfinished function
function Matrix_eigenvalues( AA ) {
	// not as simple as being the diagonal of an upper or lower triangular matrix
	// however, a diagonalized matrix would show true eigenvalues along the diagonal (but may incorporate complex numbers / involve spectral analysis)
	
	// could convert matrix into a characteristic polynomial and find its roots (Newton's method?), which would be the eigenvalues. Still difficult to find all the roots.
	
	// the standard algorithm for computing eigenvalues is the QR-algorithm:
	// involves QR-factorization of the matrix
	// STEP 1: need to factor AA into the product of an orthogonal and an upper triangular matrix: AA = QR 
	
	if (AA.numRows != AA.numColumns) throw "Matrix dimensions must be n x n"
	
	/*
	const AA_diag = Matrix_diagonal(AA)
	
	const Eigenvalues = new Array(AA.numRows)
	
	for (var i = 0; i < AA.numRows; i++) {
		Eigenvalues[i] = AA_diag[[i,i]]
	}
	
	return Eigenvalues
	*/
	return "Matrix_eigenvalues function hasn't been written yet!"
}

function Matrix_identity( AA_or_row, column ) {
	
	var numRows, numColumns
	if (column == undefined) {
		// AA_or_row == AA
		numRows    = AA_or_row.numRows
		numColumns = AA_or_row.numColumns
	} else {
		numRows    = AA_or_row
		numColumns = column
	}
	
	const NewMatrix = new Matrix(numRows, numColumns)
	for (var i = 0; i < Math.min(numRows, numColumns); i++) {
		NewMatrix[[i,i]] = 1
	}
	
	return NewMatrix
}

/*---- to specified column_place of a copy of AA, inserts: ----*/
// column of zeroes by default (when no Column specified), Column of a number, Matrix
function Matrix_insert_columns( AA, column_place, Column ) {
	if (column_place < 0 || column_place > AA.numColumns) throw "Invalid column range!"
	
	if (column_place == undefined) {
		column_place = AA.numColumns
	}
	
	var NewMatrix
	var pad = 0
	
	// If Column is an Array, number, or undefined
	if (Column instanceof Matrix == false) {
		NewMatrix = new Matrix(AA.numRows, AA.numColumns +1)
		
		// If Column is just a number, create Array filled with number
		if (typeof(Column) == "number") {
			const NewList = new Array(AA.numRows)
			Column = NewList.fill(Column)
		}
		
		// fill in NewMatrix with Array in proper place
		if (Column != undefined) {
			for (var i = 0; i < AA.numRows; i++) {
				NewMatrix[[i,column_place]] = Column[i]
			}
		}
		
		// fill in the rest of NewMatrix with AA
		for (var j = 0; j < AA.numColumns; j++) {
			if (j == column_place) pad++
			for (var i = 0; i < AA.numRows; i++) {
				NewMatrix[[i,j + pad]] = AA[[i,j]]
			}
		}
	}
	
	if (Column instanceof Matrix) {
		NewMatrix = new Matrix(AA.numRows, AA.numColumns +Column.numColumns)
		
		// fill in NewMatrix with Column(s) in proper place
		for (var j = 0; j < AA.numColumns; j++) {
			for (var i = 0; i < AA.numRows; i++) {
				NewMatrix[[i,column_place + j]] = Column[[i,j]]
			}
		}
		
		// fill in the rest of NewMatrix with AA
		for (var j = 0; j < AA.numColumns; j++) {
			if (j == column_place) pad += Column.numColumns
			for (var i = 0; i < AA.numRows; i++) {
				NewMatrix[[i,j + pad]] = AA[[i,j]]
			}
		}
		
	}
	
	return NewMatrix
}

/*---- to specified row_place of a copy of AA, inserts: ----*/
// row of zeroes by default (when no Row specified), Row of a number, Matrix
function Matrix_insert_rows( AA, row_place, Row ) {
	if (row_place < 0 || row_place > AA.numRows) throw "Invalid row range!"
	
	if (row_place == undefined) {
		row_place = AA.numRows
	}
	
	var NewMatrix
	var pad = 0
	
	// If Row is an Array, number, or undefined
	if (Row instanceof Matrix == false) {
		NewMatrix = new Matrix(AA.numRows +1, AA.numColumns)
		
		// If Row is just a number, create Array filled with number
		if (typeof(Row) == "number") {
			const NewList = new Array(AA.numColumns)
			Row = NewList.fill(Row)
		}
		
		// fill in NewMatrix with Array in proper place
		if (Row != undefined) {
			for (var j = 0; j < AA.numColumns; j++) {
				NewMatrix[[row_place,j]] = Row[j]
			}
		}
		
		// fill in the rest of NewMatrix with AA
		for (var i = 0; i < AA.numRows; i++) {
			if (i == row_place) pad++
			for (var j = 0; j < AA.numColumns; j++) {
				NewMatrix[[i + pad,j]] = AA[[i,j]]
			}
		}
	}
	
	if (Row instanceof Matrix) {
		NewMatrix = new Matrix(AA.numRows +Row.numRows, AA.numColumns)
		
		// fill in NewMatrix with Row(s) in proper place
		for (var i = 0; i < Row.numRows; i++) {
			for (var j = 0; j < Row.numColumns; j++) {
				NewMatrix[[row_place + i, j]] = Row[[i,j]]
			}
		}
		
		// fill in the rest of NewMatrix with AA
		for (var i = 0; i < AA.numRows; i++) {
			if (i == row_place) pad += Row.numRows
			for (var j = 0; j < AA.numColumns; j++) {
				NewMatrix[[i + pad, j]] = AA[[i,j]]
			}
		}
	}

	return NewMatrix
}

// Uses Gauss-Jordan elimination to find the inverse, if invertible
function Matrix_inverse( AA ) {
	if (AA.numRows != AA.numColumns) throw "The input must be a square matrix!"
	// an inverse will only exist if the determinant is not zero
	
	if (Matrix_determinant(AA) == 0) {
		//Matrix is not invertible!
	}
	
	// if Matrix is 1x1, the inverse is simply the reciprocal of the single matrix entry
	if (AA.numRows == 1 && AA.numColumns == 1) {
	    var inverse = Number(1/(AA[[0,0]]))
	    var newArray = [inverse]
	    var AA_Identity = new Matrix(AA.numRows, AA.numColumns, newArray)
	    return AA_Identity
	}
	
	// do gauss-jordan elimination
	var AA_to_Identity = new Matrix(AA.numRows, AA.numColumns, [...AA.List])
	var Identity_to_Inverse = Matrix_identity(AA)
	
	// FOR EACH DIAGONAL
	for (var i = 0; i < AA_to_Identity.numRows; i++) {
		// store i to reset later
		var diagonal_subscript = i
		// make subscripts the diagonal
		var j = diagonal_subscript
		
		var diagonal = AA_to_Identity[[diagonal_subscript,diagonal_subscript]]
		
		// ROW SWAP
		// if diagonal of AA_to_Identity == 0, find first valid column entry and swap rows
		if (diagonal == 0) {

			// look at the rest of column i
			for (var j = i; j < AA_to_Identity.numRows; j++) {
				// swap rows with first non-zero entry
				if (AA_to_Identity[[i,j]] != 0) {
					var row_a_index = i
					var row_b_index = j
					AA_to_Identity.swap_rows_(row_a_index, row_b_index)
					
					//update Identity_to_Inverse
					Identity_to_Inverse.swap_rows_(row_a_index, row_b_index)
				}
			}
			// REVISIT DIAGONAL
			// reset j
			j = diagonal_subscript
			//reset diagonal
			diagonal = AA_to_Identity[[diagonal_subscript, diagonal_subscript]]
		}
		
		// MAKE DIAGONAL == 1
		// if diagonal != 1, divide row by diagonal
		if (diagonal != 1) {
			for (var j = 0; j < AA_to_Identity.numColumns; j++) {
				AA_to_Identity[[i,j]] = AA_to_Identity[[i,j]]/diagonal
				// divide corresponding identity row by diagonal
				Identity_to_Inverse[[i,j]] = Identity_to_Inverse[[i,j]]/diagonal
			}
		}
		
		// eliminate non-zero entries above diagonal in column diagonal_subscript
		for (i = 0; i < diagonal_subscript; i++) {
			if (AA_to_Identity[[i,diagonal_subscript]] != 0) {
				var multiplier = AA_to_Identity[[i,diagonal_subscript]]
				// update row
				for(j = 0; j < AA_to_Identity.numColumns; j++) {
					AA_to_Identity[[i,j]] = AA_to_Identity[[i,j]] -
					AA_to_Identity[[diagonal_subscript,j]] *multiplier
					
					// update Identity_to_Inverse's row
					Identity_to_Inverse[[i,j]] = Identity_to_Inverse[[i,j]] -
					Identity_to_Inverse[[diagonal_subscript,j]] *multiplier
				}
			}
		}
		// RESET SUBSCRIPTS TO BE AT DIAGONAL AGAIN
		// reset i
		i = diagonal_subscript
		// reset j
		j = diagonal_subscript	
		
		
		// eliminate any non-zero entries below diagonal in column i
		// if i is not at the end of the column yet (last row index)
		if (i < AA_to_Identity.numColumns -1) {
			
			// eliminate rest of the column
			for (var i = diagonal_subscript +1; i < AA_to_Identity.numRows; i++) {
				// if column entry != 0
				if (AA_to_Identity[[i,j]] != 0) {

					//return AA_to_Identity
					var multiplier = AA_to_Identity[[i,j]]
					// eliminate across row
					for (var j = 0; j < AA_to_Identity.numRows; j++) {
						// i=2, j=0
						AA_to_Identity[[i,j]] = AA_to_Identity[[i,j]] - 
						(AA_to_Identity[[diagonal_subscript,j]] *multiplier)
						
						// update corresponding Identity_to_Inverse
						Identity_to_Inverse[[i,j]] = Identity_to_Inverse[[i,j]] - 
						(Identity_to_Inverse[[diagonal_subscript,j]] *multiplier)
					}
					j = diagonal_subscript
				}
			}
		} 
		
		// reset i
		i = diagonal_subscript
		
	}
	
	
	
	return Identity_to_Inverse
}

// Leibniz function for 2x2 matrices
function Matrix_leibniz_determinant( AA ) {
	if (AA.numRows != 2 || AA.numColumns != 2) throw "Invalid matrix input!"
	
	const a = AA[[0,0]]
	const b = AA[[0,1]]
	const c = AA[[1,0]]
	const d = AA[[1,1]]
	
	const precision = 1e-2
	
	return Math.round((a * d - b * c)/precision)*precision
}

function Matrix_2x2_determinant( AA ) {
	
	return Matrix_leibniz_determinant(AA)
}

function Matrix_3x3_determinant( AA ) {
	if (AA.numColumns != 3 || AA.numRows != 3) throw "Must be a 3x3 matrix!"
	
	const precision = 1e-2
	
	return Math.round((	AA[[0,0]]*AA[[1,1]]*AA[[2,2]] - AA[[0,0]]*AA[[1,2]]*AA[[2,1]] -
		   				AA[[0,1]]*AA[[1,0]]*AA[[2,2]] + AA[[0,1]]*AA[[1,2]]*AA[[2,0]] +
		   				AA[[0,2]]*AA[[1,0]]*AA[[2,1]] - AA[[0,2]]*AA[[1,1]]*AA[[2,0]] )/precision)*precision
}

// multiply two Matrices and return a new resulting Matrix (STATIC FUNCTION)
function Matrix_multiply( AA, BB ) {
	if (AA.numColumns != BB.numRows) throw "Mismatched matrix dimensions!"
	
	var NewMatrix = new Matrix(AA.numRows, BB.numColumns)
	var n = 0
	for (var j = 0; j < NewMatrix.numColumns; j++) {
		for (var i = 0; i < NewMatrix.numRows; i++) {
			for (var k = 0; k < BB.numRows; k++) {
					NewMatrix[[i, j]] += AA[[i,k]]*BB[[k, j]]
			}
		}
	}
	
	return NewMatrix
}

function Matrix_ones_vector( AA ) {
    
    var OnesList = new Array(AA.numRows)
    OnesList.fill(1)    
    var OnesAA = new Matrix(AA.numRows, 1, OnesList)
    
    return OnesAA
}

// sort in ascending order for column 0
function Matrix_sort_by_X( AA ) {
	var madeSwap = true
	var AASorted = new Matrix(AA.numRows, AA.numColumns, [...AA.List])
	
	while (madeSwap) {
		madeSwap = false
		for (var i = 0; i < AA.numRows -1; i++) {
			if (AASorted[[i, 0]] > AASorted[[i +1, 0]]) {
				AASorted.swap_rows_(i, i +1)
				madeSwap = true
			}
		}
	}

	return AASorted
}

// sort in ascending order for column 1
function Matrix_sort_by_Y( AA ) {
	var madeSwap = true
	var AASorted = new Matrix(AA.numRows, AA.numColumns, [...AA.List])
	
	while (madeSwap) {
		madeSwap = false
		for (var i = 0; i < AA.numRows -1; i++) {
			if (AASorted[[i, 1]] > AASorted[[i +1, 1]]) {
				AASorted.swap_rows_(i, i +1)
				madeSwap = true
			}
		}
	}

	return AASorted
}

function Matrix_swap_rows( AA, row_a_index, row_b_index ) {
	if (row_a_index < 0 || row_a_index >= AA.numRows) throw "Invalid index for row \'a\'"
	if (row_b_index < 0 || row_b_index >= AA.numRows) throw "Invalid index for row \'b\'"
	
	var NewMatrix = new Matrix(AA.numRows, AA.numColumns, [...AA.List])
	
	for (var j = 0; j < NewMatrix.numColumn; j++) {
		for (var i = 0; i < NewMatrix.numRows; i++) {
			NewMatrix[[i, j]] = AA[[i,j]]
		}
	}
	
	for (var i = 0; i < NewMatrix.numColumns; i++) {
		var a_entry_copy = NewMatrix[[row_a_index, i]]
		// replace a with b
		NewMatrix[[row_a_index, i]] = NewMatrix[[row_b_index, i]]
		//replace b with a
		NewMatrix[[row_b_index, i]] = a_entry_copy
		
	}
	
	return NewMatrix
}

function Matrix_swap_columns( AA, column_a_index, column_b_index ) {
	if (column_a_index < 0 || column_a_index >= AA.numColumns) throw "Invalid index for column \'a\'"
	if (column_b_index < 0 || column_b_index >= AA.numColumns) throw "Invalid index for column \'b\'"
	
	var NewMatrix = new Matrix(AA.numRows, AA.numColumns, [...AA.List])
	
	for (var i = 0; i < NewMatrix.numRows; i++) {
		var a_entry_copy = NewMatrix[[i, column_a_index]]
		// replace a with b
		NewMatrix[[i, column_a_index]] = NewMatrix[[i, column_b_index]]
		//replace b with a
		NewMatrix[[i, column_b_index]] = a_entry_copy
		
	}
	
	return NewMatrix
}

function Matrix_transpose( AA ) {
	var AATranspose = new Matrix(AA.numColumns, AA.numRows)
	
	for (var j = 0; j < AA.numColumns; j++) {
		for (var i = 0; i < AA.numRows; i++) {
			AATranspose[[j, i]] = AA[[i, j]]
		}
	}

	return AATranspose
}

// used for finding the determinant
function Matrix_upper_triangular( AA ) {
	// need to keep track of determinant's sign multiplier
	var sign = 1
	
	// necessary to copy AA's list, so it isn't overwritten
	var AA_upper = new Matrix(AA.numRows, AA.numColumns, [...AA.List])
	var diagonal_subscript
	
	// look at column i
	for (var i = 0; i < AA_upper.numColumns; i++) {
		var j = i
		diagonal_subscript = i
		
		// if diagonal entry == 0
		if (AA_upper[[i, j]] == 0) {
			
			// look at the rest of column j
			for (var i = diagonal_subscript +1; i < AA_upper.numRows; i++) {
				// swap rows with first non-zero entry
				if (AA_upper[[i, j]] != 0) {
					
					// swap bad diagonal row with newly found valid row
					AA_upper.swap_rows_(diagonal_subscript, i)
					sign *= -1
					
				}
			}
		}
		// reset i
		i = diagonal_subscript
		
		// if diagonal is not at the end of the column yet (-1 since index starts at 0)...
		if (i < AA_upper.numColumns -1) {
			
			// eliminate rest of the column
			for (var i = diagonal_subscript +1; i < AA_upper.numRows; i++) {
				// if column entry != 0
				if (AA_upper[[i, diagonal_subscript]] != 0) {
					
					var multiplier = AA_upper[[i, diagonal_subscript]]
					// eliminate across row
					for (var j = 0; j < AA_upper.numColumns; j++) {
						AA_upper[[i,j]] = AA_upper[[i,j]] - 
						(AA_upper[[diagonal_subscript, j]]/AA_upper[[diagonal_subscript, diagonal_subscript]] * multiplier)
					}
				}
			}
		}
		
		// reset i
		i = diagonal_subscript

	}

	AA_upper.determinantMultiplier = sign
	
	return AA_upper
}


function print( obj, end ) {
	if (end == undefined) end = '\n'
	document.getElementById("console").innerHTML += obj + end
}

 

function clear() {
	document.getElementById("console").innerHTML = ''
}

// window.onload = main