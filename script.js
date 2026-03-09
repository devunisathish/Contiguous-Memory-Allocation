function showSection(id){
document.getElementById("contiguous").classList.add("hidden")
document.getElementById("strategy").classList.add("hidden")
document.getElementById(id).classList.remove("hidden")
}

/* ================= CONTIGUOUS ================= */

let queue=[]
let ram=[]
let partitionType="fixed"

function initContiguous(){

partitionType=document.getElementById("partitionType").value

if(partitionType==="fixed"){

ram=[
{type:"free",size:200},
{type:"free",size:200},
{type:"free",size:200},
{type:"free",size:200}
]

}else{

ram=[
{type:"free",size:800}
]

}

renderRAM()

}

initContiguous()

function renderRAM(){

let container=document.getElementById("ram")
container.innerHTML=""

ram.forEach(block=>{

let div=document.createElement("div")
div.className="block"

if(block.type==="free"){

div.classList.add("free")
div.innerHTML="Free<br>"+block.size

}else{

div.innerHTML=
block.name+"<br>"+block.used+
"<br>Frag:"+block.fragment

}

container.appendChild(div)

})

}

function renderQueue(){

let q=document.getElementById("queue")
q.innerHTML=""

queue.forEach(p=>{

let d=document.createElement("div")
d.className="process"
d.innerText=p.name+"("+p.size+")"

q.appendChild(d)

})

}

function addProcess(){

let name=document.getElementById("pname").value
let size=parseInt(document.getElementById("psize").value)

if(!name || !size) return

queue.push({name,size})

renderQueue()

}

/* -------- Allocation -------- */

function allocateContiguous(){

if(queue.length===0) return

let p=queue.shift()

for(let i=0;i<ram.length;i++){

let block=ram[i]

if(block.type==="free" && block.size>=p.size){

if(partitionType==="fixed"){

ram[i]={
type:"process",
name:p.name,
used:p.size,
fragment:block.size-p.size
}

}else{

let remaining=block.size-p.size

ram.splice(i,1,{
type:"process",
name:p.name,
used:p.size,
fragment:0
})

if(remaining>0){

ram.splice(i+1,0,{
type:"free",
size:remaining
})

}

}

break

}

}

renderRAM()
renderQueue()

}

/* -------- Compaction -------- */

function compact(){

if(partitionType==="fixed") return

let used=ram.filter(b=>b.type==="process")
let freeTotal=ram
.filter(b=>b.type==="free")
.reduce((sum,b)=>sum+b.size,0)

ram=[...used]

if(freeTotal>0){

ram.push({
type:"free",
size:freeTotal
})

}

renderRAM()

}

/* -------- Reset -------- */

function resetContiguous(){

queue=[]
initContiguous()
renderQueue()

}

/* ================= STRATEGIES ================= */

let squeue=[]
let blocks=[100,500,200,300,600]

function renderBlocks(){

let c=document.getElementById("blocks")
c.innerHTML=""

blocks.forEach(b=>{

let div=document.createElement("div")
div.className="block"

if(typeof b==="number"){

div.classList.add("free")
div.innerHTML="Free<br>"+b

}else{

div.innerHTML=b.name+"<br>"+b.size

}

c.appendChild(div)

})

}

renderBlocks()

function renderSQueue(){

let q=document.getElementById("squeue")
q.innerHTML=""

squeue.forEach(p=>{

let d=document.createElement("div")
d.className="process"
d.innerText=p.name+"("+p.size+")"

q.appendChild(d)

})

}

function addStrategyProcess(){

let name=document.getElementById("spname").value
let size=parseInt(document.getElementById("spsize").value)

if(!name || !size) return

squeue.push({name,size})

renderSQueue()

}

function allocateStrategy(){

if(squeue.length===0) return

let p=squeue.shift()

let strategy=document.getElementById("strategyType").value
let index=-1

if(strategy==="first"){

for(let i=0;i<blocks.length;i++){

if(typeof blocks[i]==="number" && blocks[i]>=p.size){

index=i
break

}

}

}

if(strategy==="best"){

let best=Infinity

for(let i=0;i<blocks.length;i++){

if(typeof blocks[i]==="number" &&
blocks[i]>=p.size &&
blocks[i]<best){

best=blocks[i]
index=i

}

}

}

if(strategy==="worst"){

let worst=-1

for(let i=0;i<blocks.length;i++){

if(typeof blocks[i]==="number" &&
blocks[i]>=p.size &&
blocks[i]>worst){

worst=blocks[i]
index=i

}

}

}

if(index!==-1){

blocks[index]={name:p.name,size:p.size}

}

renderBlocks()
renderSQueue()

}

function resetStrategy(){

blocks=[100,500,200,300,600]
squeue=[]

renderBlocks()
renderSQueue()

}