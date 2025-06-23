const prop = {
    transCode : 'TARSTLOST',
	textChar : 'LST',
	msgCode : '0302'	
}

const send = [
    { name:'gbn' 				    ,  length:1 },
    { name:'sendmsg' 				,  length:20 },
    { name:'id' 			        ,  length:6 },
    { name:'pw' 				    ,  length:4 }
]
  
const recv = [
    { name:'revmsg' 	    ,  length:8 },
    { name:'id' 			,  length:6 }, 
    { name:'name' 			,  length:6 },
    { name:'val' 			,  length:2 },
    { name:'반복부횟수'         ,  length:2 },
	{ name : '반복부' 			, length:0 ,
        element : [
			{ name:'code' 	    ,  length:2 }, 
			{ name:'codenm' 	,  length:4 }, 

       ]
   }
]
  
module.exports = {
 	send,
	recv
}