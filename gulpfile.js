const{src, dest, watch, parallel} = require("gulp");
//src : identifica un archivo
//dest : sirve para guardarlo
const sass = require("gulp-sass")(require('sass'));
const plumber = require('gulp-plumber');
//simplificar nuestro hoja de codigo css
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');

//Imagenes convertir a webp
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
//Imagenes convertir a Avif
const avif = require('gulp-avif');
//sirve para mapear y enncontrar sectores de la web q deseo modificar
const sourcemaps = require('gulp-sourcemaps');
//PARA SIMPLIFICAR EL CODIGO JS
const terser = require('gulp-terser-js');




function css(done){
     src('src/scss/**/*.scss') //Identificar el archivo SASS
     .pipe(sourcemaps.init())
     .pipe(plumber()) // Sirve para no detener el autoguardado en caso de errores!!!!!..
     .pipe(sass()) //Compilar
     .pipe(postcss([autoprefixer(), cssnano()]))
     .pipe(sourcemaps.write('.'))
     .pipe(dest('biuld/css')) //Almasenarla en el dsico duro
    done();// Avisa al gulp cuando llegamos al final.
}
function imagenes (done){
    const opciones = {
        optimizationLevel: 3
    }
    src('festivalmusica_inicio/img/**/*.{png,jpg}')
    .pipe(cache(imagemin(opciones)))
     .pipe(dest('biuld/img'))
    
    done();
}
function versionWebp (done) {
    const opciones ={
        quality: 50
    };
    src('festivalmusica_inicio/img/**/*.{png,jpg}')
       .pipe( webp(opciones))
       .pipe(dest('biuld/img'))
    done();
}
function versionAvif (done) {
    const opciones ={
        quality: 50
    };
    src('festivalmusica_inicio/img/**/*.{png,jpg}')
       .pipe( avif(opciones))
       .pipe(dest('biuld/img'));
    done();
}
function javascrip(done){
    src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('biuld/js'));

    done();
}

    //compilado automatico 
function dev(done){
    watch('src/scss/**/*.scss', css); 
    watch('src/js/**/*.js',javascrip);  
    done();
}
exports.css = css; 
exports.js = javascrip; 
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes,versionWebp,versionAvif,javascrip,dev);