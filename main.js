status="";
objects=[];

function setup()
{
    canvas=createCanvas(250, 250);
    canvas.center();
    video = createCapture(VIDEO);
    video.size(350,350);
    video.hide();
}

function start()
{
    objectDetector=ml5.objectDetector("cocossd", modelLoaded);
    document.getElementById("status").innerHTML="Status: Detecting objects";
    object_name=document.getElementById("object_name").value;
}

function modelLoaded()
{
    console.log("Model has loaded!");
    status=true;
}

function draw()
{
    image(video, 0,0,350,350);
    if(status!="")
    {
        objectDetector.detect(video,gotResult);
        for(i=0; i<objects.length; i++)
        {
            document.getElementById("status").innerHTML="Status: Objects Detected";

            fill("#FF0000");
            percent=floor(objects[i].confidence*100);
            text(objects[i].label+""+percent+"%",objects[i].x+15,objects[i].y+15);
            noFill();
            stroke("#FF0000");
            rect(objects[i].x,objects[i].y,objects[i].width,objects[i].height);
            if(objects[i].label==object_name)
            {
                video.stop();
                objectDetector.detect(gotResult);
                document.getElementById("objects_status").innerHTML=object_name+"found";
                synth=window.speechSynthesis;
                utterThis=new SpeechSynthesisUtterance(object_name+" found");
                synth.speak(utterThis);
            }
            else
            {
                document.getElementById("objects_status").innerHTML=object_name+" not found";
            }
        }
    }
}

function gotResult(error,results)
{
    if(error)
    {
        console.error(error);
    }
    else
    {
        console.log(results);
        objects=results;
    }
}