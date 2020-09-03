const express = require('express')
const oprs = ['+', '-', '*', '/']
let waysArr = new Set()
let resultArr = new Set()

exports.index = async (req, res) => {
    waysArr = new Set()
    resultArr = new Set()
    const { numbers } = req.params
    if (numbers.length < 4) {
        res.status(400).send("Please sent 4 integer number")
    

    }else{
        const numberArr = numbers.split("")
        numberArr.forEach( value => {
            if (isNaN(value) || value == '0') {
                res.status(400).send("Please sent 4 integer ")
            }
        })


        findWays(numberArr)
        waysArr.forEach((arr) => {
            const [v1,v2,v3,v4] = arr
            find("",0,[v1,v2,v3,v4])
        })
        if (resultArr.size == 0) {
            res.status(200).send("No Result")
        }else{
            res.status(200).send({
                result:'YES',
                methods:[...resultArr]
            })
        }
        
        
    }




}

function findWays(numbersArr) {
    const n = numbersArr
    let resultArr = new Set()
    build(n.length, "", n)
}

// Depth First Search
function build(level, numStr, arr) {
    if (level == 0) {
        waysArr.add(numStr)
    } else {
        for (let i = 0; i < arr.length; i++) {
            const v = arr[i]
            const newArr = [...arr]
            newArr.splice(i, 1)
            build(level - 1, `${numStr}${v}`, newArr)
        }
    }
}

// Calculate Depth First Search

function calEachOperand(v1,v2) {
    let returnArray = []
    let statement = ""
    let result = 0
    oprs.forEach(ops => {
        switch (ops) {
            case '+':
                statement = `(${v1}+${v2})`
                result = parseFloat(v1) + parseFloat(v2)
                returnArray[0] = {
                    result:result,
                    statement:statement
                }
                break;
            case '-':
                statement = `(${v1}-${v2})`
                result = parseFloat(v1) - parseFloat(v2)
                returnArray[1] = {
                    result:result,
                    statement:statement
                }
                break;
            case '*':
                statement = `(${v1}*${v2})`
                result = parseFloat(v1) * parseFloat(v2)
                returnArray[2] = {
                    result:result,
                    statement:statement
                }
                break;
            case '/':
                statement = `(${v1}/${v2})`
                result = parseFloat(v1) / parseFloat(v2)
                returnArray[3] = {
                    result:result,
                    statement:statement
                }
                break;
        }
    })
    return returnArray
}

function calEachOperandWithStatement(state,v1,v2) {
    let returnArray = []
    let statement = ""
    let result = 0
    oprs.forEach(ops => {
        switch (ops) {
            case '+':
                statement = `(${state}+${v2})`
                result = parseFloat(v1) + parseFloat(v2)
                returnArray[0] = {
                    result:result,
                    statement:statement
                }
                break;
            case '-':
                statement = `(${state}-${v2})`
                result = parseFloat(v1) - parseFloat(v2)
                returnArray[1] = {
                    result:result,
                    statement:statement
                }
                break;
            case '*':
                statement = `(${state}*${v2})`
                result = parseFloat(v1) * parseFloat(v2)
                returnArray[2] = {
                    result:result,
                    statement:statement
                }
                break;
            case '/':
                statement = `(${state}/${v2})`
                result = parseFloat(v1) / parseFloat(v2)
                returnArray[3] = {
                    result:result,
                    statement:statement
                }
                break;
        }
    })
    return returnArray
}

function find(state,result,arr=[]) {
    if (arr.length == 0) {
        if (result == 24) {
            resultArr.add(state + "=" + result)
        }
    }else{
        const [v1,v2,v3,v4] = arr
        const resArr1 = calEachOperand(v1,v2)
        const resArr2 = calEachOperand(v3,v4)
        let resArr3 = new Array()
        resArr1.forEach( (res1) => {
            resArr2.forEach( (res2) => {
                let statement = ""
                let result = 0
                oprs.forEach( (opr) => {
                    switch (opr) {
                        case '+':
                            statement = `(${res1.statement}+${res2.statement})`
                            result = parseFloat(res1.result) + parseFloat(res2.result)
                            find(statement,result)
                            break;
                        case '-':
                            statement = `(${res1.statement}-${res2.statement})`
                            result = parseFloat(res1.result) - parseFloat(res2.result)
                            find(statement,result)
                            break;
                        case '*':
                            statement = `(${res1.statement}*${res2.statement})`
                            result = parseFloat(res1.result) * parseFloat(res2.result)
                            find(statement,result)
                            break;
                        case '/':
                            statement = `(${res1.statement}/${res2.statement})`
                            result = parseFloat(res1.result) / parseFloat(res2.result)
                            find(statement,result)
                            break;
                    }
                })
                
            })
            resArr3.push(calEachOperandWithStatement(res1.statement,res1.result,v3))
        }) 

        resArr3.forEach((resArr) => {
            resArr.forEach( (res) => {
                const resArr4 = calEachOperandWithStatement(res.statement,res.result,v4)
                resArr4.forEach( res => {
                    find(res.statement,res.result)
                })
            })
        })
    }
}

