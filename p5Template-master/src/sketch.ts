// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    mode : 0,
    nbreRayons : 492,
    seed : 0,
    courbure : 8,
    longueurRayons : 10,
    Download_Image: () => save(),
}
gui.add(params, "mode", 0, 1, 1)
gui.add(params, "seed", 0, 100, 1)
gui.add(params, "nbreRayons", 0, 500, 1)
let courbure = gui.add(params, "courbure", 0, 50, 1)
gui.add(params, "Download_Image")


// -------------------
//       Drawing
// -------------------

function courbeHorizontal(x0: number, y0: number, x1: number, y1: number, pasX: number)
{
    let coeffDirecteur = (y1-y0)/(x1-x0)
    noiseSeed(random(1000))

    beginShape()
    let start = 0
    let i=x0

    if (pasX==1)
    {
        while(i<=x1)
        { 
        let t = noise(start)
        let yMap = map(t, 0, 1, -params.courbure, params.courbure)
        curveVertex(i, coeffDirecteur*i+yMap)
        start+=random()/5
        i++
        }
    }

    else
    {
        while(i>=x1)
        { 
        let t = noise(start)
        let yMap = map(t, 0, 1, -params.courbure, params.courbure)
        curveVertex(i, coeffDirecteur*i+yMap)
        start+=random()/5
        i--;
        }
    }
    
    endShape()
}

function courbeVertical(x0: number, y0: number, x1: number, y1: number, pasY: number)
{
    let coeffDirecteur = (x1-x0)/(y1-y0)
    noiseSeed(random(1000))

    beginShape()
    let start = 0
    let i=y0

    if (pasY==1)
    {
        while(i<=y1)
        { 
        let t = noise(start)
        let yMap = map(t, 0, 1, -params.courbure, params.courbure)
        curveVertex(coeffDirecteur*i+yMap, i)
        start+=random()/5
        i++
        }
    }

    else
    {
        while(i>=y1)
        { 
        let t = noise(start)
        let yMap = map(t, 0, 1, -params.courbure, params.courbure)
        curveVertex(coeffDirecteur*i+yMap, i)
        start+=random()/5
        i--;
        }
    }
    
    endShape()
}

function draw() {

    randomSeed(params.seed)
    let xCenter = width/2
    let yCenter = height/2
    const xRect=200 //Previously yRect-50
    let yRect=200
    let nbreRayons=params.nbreRayons
    let colors = ['red', 'blue', 'yellow', 'purple']
    let ESPACEMENT = 5

    background(255)
    push()
    translate(xCenter , yCenter);
    
    let v1=createVector( // On commence par tracer le premier rayon comme une ligne horizontale (l'axe Ox)
        1,
        0
    )

    let hauteur = 0.90*height/2
    let largeur = 0.90*width/2 //Idée paramètres : Changer le 0.90 pour modifier l'envergure du losange

    // LE LOSANGE // 4 points => Nord, Est, Sud, Ouest qui reliés forment le losange délimitant 
    let Nord = createVector(0, -hauteur) // Point nord du losange (i.e en haut), les autres noms parlent d'eux même
    let Est = createVector(largeur, 0)
    let Sud = createVector(0, hauteur)
    let Ouest = createVector(-largeur, 0)
    

    /*
    beginShape(LINES)
    vertex(Nord.x, Nord.y) //Ligne Haut/Gauche, idemn pour les autres vertex
    vertex(Est.x, Est.y)

    vertex(Est.x, Est.y)
    vertex(Sud.x, Sud.y)

    vertex(Sud.x, Sud.y)
    vertex(Ouest.x, Ouest.y)

    vertex(Ouest.x, Ouest.y)
    vertex(Nord.x, Nord.y)

    endShape()
    */

    for (let i=0; i<nbreRayons/2; i++) // On fait un quart de tour de cercle, et à chaque tour de boucle on dessine 4 rayons par symétrie
    {
        let angle=(PI/nbreRayons) 
        let c1 = cos(angle)
        let s1 = sin(angle)

        stroke(random(colors))
        let x1 = v1.x // V1 vecteur directeur du rayon (donc comme tous les rayons passent par ce vecteur)
        let y1 = v1.y
        v1.x = x1*c1 - y1*s1
        v1.y = s1*x1 + c1*y1 // On translate ce vecteur de PI/nbRayon radians et on obtient un nouveau vecteur directeur
        
        let xPiL = -xRect/2
        let yPiL = (v1.y*xRect/2)/v1.x // Pi(xPiL, yPiL ) ==> Intersection entre le coté gauche/Droit du carré et le rayon
        
        let xPiH = -(v1.x*yRect/2)/(v1.y) // Intersection entre le haut/bas (par symétrie) du carré et le rayon
        let yPiH = -yRect/2       
        
        let xDecalage=random(-10, 11)*1 // Pour que les rayons aient une longneur et une courbure plus ou moins aléatoire (test avec des lignes sans noise)
        let yDecalage=random(-10, 11)*1
        let xDecalage2=random(-10, 11)*1
        let yDecalage2=random(-10, 11)*1

        let t = (-largeur*hauteur)/(hauteur*x1+largeur*y1) // MATHS  (xNO, yNO) ==> Solution de l'intersection entre le rayon et le côté correct du losange
        let xNO = x1*t // Equations Paramétrique, vive l'algèbre <3
        let yNO = y1*t // Par symétrie, on retrouve les intersections entre les 4 côtés du losange :
                      // Le point intersection NORD/OUEST est le symétrique par rapport à Oy du point d'intersection NORD/EST et ainsi de suite
       
        if (params.mode==1) // Courbe
        {
            if (yPiL>=-yRect/2 && yPiL<= yRect/2) // Si le point est sur les lignes G/D du carré
            {
                courbeHorizontal(xPiL+xDecalage, yPiL+yDecalage, xNO+xDecalage2, -yNO+yDecalage2, -1)  // Intersection entre les lignes G/D du carré et les côtés du losange correspondant
                courbeHorizontal(xPiL+xDecalage, -yPiL+yDecalage, xNO+xDecalage2, yNO+yDecalage2, -1)
                
                courbeHorizontal(-xPiL+xDecalage, -yPiL+yDecalage, -xNO+xDecalage2, yNO+yDecalage2, 1)  
                courbeHorizontal(-xPiL+xDecalage, yPiL+yDecalage, -xNO+xDecalage2, -yNO+yDecalage2, 1)
            }                                                                                                     

            else 
            {
                courbeVertical(xPiH+xDecalage, yPiH+yDecalage, xNO+xDecalage2, yNO+yDecalage2, -1) //Intersection entre les lignes H/B du carré et les côtés du losange correspondant
                courbeVertical(-xPiH+xDecalage, yPiH+yDecalage, -xNO+xDecalage2, yNO+yDecalage2, -1)

                courbeVertical(-xPiH+xDecalage, -yPiH+yDecalage, -xNO+xDecalage2, -yNO+yDecalage2, 1)
                courbeVertical(xPiH+xDecalage, -yPiH+yDecalage, xNO+xDecalage2, -yNO+yDecalage2, 1)
            }
        }

        else
        {
            if (yPiL>=-yRect/2 && yPiL<= yRect/2) // Si le point est sur les lignes G/D du carré
            {   
                line(xPiL+xDecalage, yPiL+yDecalage, xNO+xDecalage2, -yNO+yDecalage2)  // Intersection entre les lignes G/D du carré et les côtés du losange correspondant
                line(xPiL+xDecalage, -yPiL+yDecalage, xNO+xDecalage2, yNO+yDecalage2) // 
                    
                line(-xPiL+xDecalage, -yPiL+yDecalage, -xNO+xDecalage2, yNO+yDecalage2)  
                line(-xPiL+xDecalage, yPiL+yDecalage, -xNO+xDecalage2, -yNO+yDecalage2) 
            }                                                                                                     
    
            else 
            {
                line(xPiH+xDecalage, yPiH+yDecalage, xNO+xDecalage2, yNO+yDecalage2) //Intersection entre les lignes H/B du carré et les côtés du losange correspondant
                line(-xPiH+xDecalage, yPiH+yDecalage, -xNO+xDecalage2, yNO+yDecalage2)
    
                line(-xPiH+xDecalage, -yPiH+yDecalage, -xNO+xDecalage2, -yNO+yDecalage2)
                line(xPiH+xDecalage, -yPiH+yDecalage, xNO+xDecalage2, -yNO+yDecalage2)
            }
        }        
    }

    //let img = loadImage('sun_ii_300.png')// Image loading ne marche pas, aucune idée de pourquoi
    //image(img, 0, 0)
    pop()       
    //ellipse(xCenter, yCenter, xRect-50, yRect-25)  

}

// -------------------
//    Initialization
// -------------------

function setup() {
    p6_CreateCanvas()
    
}

function windowResized() {
    p6_ResizeCanvas()
}
