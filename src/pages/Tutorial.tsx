import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import TablaDecoComparativa from '../components/TablaDecoComparativa';
import PageLayout from '../components/layout/PageLayout';
import { MainTitle, SectionTitle } from '../components/TitleTypographies';

import instaladorImage from '../assets/instalador.png';
import configImage from '../assets/configuracion.png';
import plumaImage from '../assets/pluma.png';
import nodoImage from '../assets/nodo.png';
import selectorImage from '../assets/selector.png';
import opacidadImage from '../assets/opacidad.png';
import coordenadasImage from '../assets/coordenadas.png';
import escalearImage from '../assets/escalear.png';
import verticesImage from '../assets/vertices.png';
import curvasImage from '../assets/curvas.png';
import guardarImage from '../assets/guardar.png';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';

const Tutorial: React.FC = () => {
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState('');

  const handleFeedback = (type: 'like' | 'dislike' | null) => {
    if (feedback === null) {
      setFeedback(type);
      if (type === 'dislike') {
        setIsModalOpen(true);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFeedback(null);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const handleSubmitComment = () => {
    // Here you would typically send the comment to your backend
    console.log('Submitted comment:', comment);
    setIsModalOpen(false);
    setComment('');
  };

  return (
    <PageLayout>
      {/* Title and Button */}
      <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginBottom: 2 }}>
        <IconButton onClick={() => navigate('/moldes')} sx={{ mr: 2, mb: 2 }}>
          <ArrowBackIcon />
        </IconButton> 
        <MainTitle>¿Cómo digitalizar mis moldes?</MainTitle>
      </Box>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        El primer paso para digitalizar procesos textiles es contar con moldes digitalizados. Siguiendo este tutorial paso a paso, se pueden obtener moldes digitales en cuestión de minutos. Es nececsario descargar e instalar de forma gratuita el software Inkscape.
      </Typography>

      {/*QUE ES UNA IMÁGEN VECTORIAL */}
      <Typography variant="h6" component="h1" gutterBottom sx={{ mt: 4, textAlign: 'left' }}>
        <SectionTitle>
          ¿Qué es un molde digital?
        </SectionTitle>
      </Typography>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        Un molde digital consiste en una imagen digital (archivo en formato .svg o imágen vectorial digital) formada por líneaas que marcan el contorno de un molde.
      </Typography>

      {/*POR QUE INKSCAPE */}
      <Typography variant="h6" component="h1" gutterBottom sx={{ mt: 4, textAlign: 'left' }}>
      <SectionTitle>
        ¿Por qué digitalizar mis moldes con Inkscape?
      </SectionTitle>
      </Typography>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
      Existen múltiples alternativas para digitalizar moldes de textiles. A continuación mostramos una tabla comparativa de algunas alternativas para diseñar prendas y obtener moldes en formato digital.
      </Typography>
      <TablaDecoComparativa />
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        AccuMark o Lectra son alternativas pagas que están orientadas a la creación de prendas digitales, imitando el proceso de confección de moldes real. También existe la opción gratuita Seamly2D, que comenzó como el proyecto denominado Valentina,
        la cual posee una amplia comunidad online que comparte sus creaciones, tutoriales y brindan soporte de forma gratuita, tanto en inglés como español.
      </Typography>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
      Para utilizar SmartFactory no hace falta aprender a utilizar una herramienta de diseño profesional. Inkscape es una alternativa con la que se pueden generar imágenes SVG de propósito general. Si bien posee muchas opciones avanzadas para trabajar en tareas complejas, 
        es muy sencilla de utilizar para la digitalización de moldes.
      </Typography>
      <Typography paragraph sx={{ textAlign: 'justify' }}> 
      Siguiendo los pasos a continuación, se pueden obtener moldes en formato SVG listos para ser cargados a SmartFactory y utilizados en una tizada en cuestión de minutos. 
      </Typography>

      {/* Instalación */}
      <Typography variant="h6" component="h1" gutterBottom sx={{ mt: 4, textAlign: 'left' }}>
      <SectionTitle>
        ¿Cómo descargar inkscape?
      </SectionTitle>
      </Typography>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        Para instalar inkscape, hay que dirigirse a la {' '}
        <Link href="https://inkscape.org/release/" target="_blank" rel="noopener noreferrer">
             web oficial 
        </Link> 
        {' '} y seleccionar el sistema operativo indicado. Se descargará un instalador y deben seguirse los pasos indicados hasta completar la instalación.  El programa pesa tan solo 500MB, por lo que no se requiere contar con mucho espacio libre en el disco para su instalación.
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 0 }}>
        <Box component="figure" sx={{ m: 0, p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img 
            src={instaladorImage} 
            alt="Pantalla de instalación de Inkscape" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
          <Typography component="figcaption" variant="body2" sx={{ mt: 2, mb:2, textAlign: 'center', fontStyle: 'italic' }}>
            Pantalla de instalación de Inkscape
          </Typography>
        </Box>
      </Box>

      {/* CONFIGURACION */}
      <Typography variant="h6" component="h1" gutterBottom sx={{ mt: 4, textAlign: 'left' }}>
      <SectionTitle>
        ¿Cómo comenzar a digitalizar moldes?
      </SectionTitle>
      </Typography>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        Antes de comenzar, es necesario ajustar el tamaño de la hoja de trabajo para asegurarse de que la escala es correcta. Se puede elegir la unidad de trabajo deseada: milímetros, centímetros o pulgadas.  
        Para ello, se debe hacer click en "archivo/propiedades del documento" o utilizar el shortcut "Ctrl+Shift+D" para abrir la misma ventana.
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 0 }}>
        <Box component="figure" sx={{ m: 0, p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img 
            src={configImage} 
            alt="Pantalla para configurar la escala de trabajo" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
          <Typography component="figcaption" variant="body2" sx={{ mt: 2, mb:2, textAlign: 'center', fontStyle: 'italic' }}>
            Pantalla para configurar la escala de trabajo.
          </Typography>
        </Box>
      </Box>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        A continuación, se puede cargar una imágen del molde en cartón que se desea digitalizar para tener de fondo y utilizar como guía, haciendo click en "Archivo/Importar" (o apretando "Ctrl+I"), luego buscando la foto del molde en la computadora y hacer click en "OK".   
        Recomendammos adicionalmente bajar la opacidad de la imágen de fondo para poder ver mejor los trayectos que deben irse trazando para formar la imágen final.
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 0 }}>
        <Box component="figure" sx={{ m: 0, p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img 
            src={opacidadImage} 
            alt="Menú de color para configurar la opacidad" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
          <Typography component="figcaption" variant="body2" sx={{ mt: 2, mb:2, textAlign: 'center', fontStyle: 'italic' }}>
            Menú de configuración de relleno y tazos (bordes). En la parte inferior se puede encontrar un slider para ajustar la opacidad. Se puede acceder a él haciendo click en la imágen, o volver a abrirlo con "Ctrl + Shift + F". Se editarán las figuras seleccionadas. Consejo: Hacerle click a una figura para seleccionarla y apretar "Shift + Click" para cancelar la selección. Se pueden seleccionar multiples figuras si se tiene una figura seleccionada y se hace "Shift + Click sobre una figura distinta." 
          </Typography>
        </Box>
      </Box>

      <Typography paragraph sx={{ textAlign: 'justify' }}>
        Las herramientas de Inkscape que se deben conocer para digitalizar moldes son la herramineta pluma y la herramienta para editar nodos de trayecto o tiradores de control de curvas. Se pueden activar desde el menú lateral o con los shortcuts "B" o "N" respectivamente.  
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 0 }}>
        <Box component="figure" sx={{ m: 0, p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img 
            src={plumaImage} 
            alt="Icono Pluma en el menú lateral" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
          <Typography component="figcaption" variant="body2" sx={{ mt: 2, mb:2, textAlign: 'center', fontStyle: 'italic' }}>
            Herramienta pluma que permite marcar nodos conectados mediante trayectos. Shorcut para abrir: "B"
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 0 }}>
        <Box component="figure" sx={{ m: 0, p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img 
            src={nodoImage} 
            alt="Icono herramienta de edición de nodos en el menú lateral" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
          <Typography component="figcaption" variant="body2" sx={{ mt: 2, mb:2, textAlign: 'center', fontStyle: 'italic' }}>
            Herramienta de edición de nodos y trayectos, útil para crear curvas. Shortcut para abrir: "N"  
          </Typography>
        </Box>
      </Box>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        Los trayectos se crean automáticamente al crear y unir nodos en la hoja de dibujo, haciendo click donde se desee colocar un nodo con la herramienta pluma seleccionada. Para terminar de agregar nodos y guardar los trazos creados, se debe apretar "Enter".
        Mintras se estén colocando nuevos nodos, al presionar "Ctrl", se fuerza que el trayecto entre dos nodos que se está creando esté en un determinado ángulo. Esto es útil para crear un primer trayecto de guía. 
      </Typography>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        Para terminar de crear un molde digital se debe: 
      </Typography>
      <List>
      <ListItem>
        <Check sx={{ mr: 2 }} />
        <ListItemText primary="Crear un trayecto de guía, para escalar una línea de guía de la imagen del molde a su tamaño adecuado" />
      </ListItem>
      <ListItem>
        <Check sx={{ mr: 2 }} />
        <ListItemText primary="Seleccionar todos los vértices de la imágen digital, creando trayectos que los unan. Es importante que el nodo final coincida con el nodo incial para crear un trayecto cerrado. Se pueden guardar los cambios apretando enter y luego continuar desde un nodo haciendo click en él." />
      </ListItem>
      <ListItem>
        <Check sx={{ mr: 2 }} />
        <ListItemText primary="Editar las curvas, ajustando las trayectorias rectas con la herramienta de edición de nodos." />
      </ListItem>
      </List>

      {/* DIBUJAR */}
      <Typography variant="h6" component="h1" gutterBottom sx={{ mt: 4, textAlign: 'left' }}>
      <SectionTitle>
        ¿Cómo terminar de crear el molde digital?
      </SectionTitle>
      </Typography>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        Para crear la imágen de guía se puede crear una línea horizontal en cualquier parte de la hoja, seleccionar el primer nodo para obtener su coordanada X, y seleccionar el segundo nodo para editar su coordenada X.
        Si la foto de molde posee, por ejemplo, un borde o línea de guía que mide 400mm, el segundo nodo deberá estar a X2 = X1 + 40 unidades (con el formato ajustado para trabajar en mm desde las propiedades de la hoja, como se explicó anteriormente).
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 0 }}>
        <Box component="figure" sx={{ m: 0, p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img 
            src={coordenadasImage} 
            alt="Nodo seleccionado: Sus coordenadas X e Y se muestran en la página superior." 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
          <Typography component="figcaption" variant="body2" sx={{ mt: 2, mb:2, textAlign: 'center', fontStyle: 'italic' }}>
            Al seleccionar un nodo con la herramienta de edición de nodos, se pueden ver y editar sus coordenadas X e Y en la barra superior.
          </Typography>
        </Box>
      </Box>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        Una vez creado un trayecto horizontal de una determinada cantidad de unidades de longitud para utilizar como guía, se debe utilizar la herramienta selector para alinearlo con una línea de guía o borde del molde de esas medidas en la imágen.
        Para ello, se debe escalar la imágen manteniendo las proporciones: Esto se logra al apretar "Ctrl" a la vez que se cambia el tamaño de la imágen.
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 0 }}>
        <Box component="figure" sx={{ m: 0, p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img 
            src={selectorImage} 
            alt="Herramienta selector en el menú lateral" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
          <Typography component="figcaption" variant="body2" sx={{ mt: 2, mb:2, textAlign: 'center', fontStyle: 'italic' }}>
            Herramienta de selección simple. Shortcut para abrir: "S"  
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 0 }}>
        <Box component="figure" sx={{ m: 0, p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img 
            src={escalearImage} 
            alt="Flechas en los vértices de una imágen que se utilizan para escalar la imágen." 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
          <Typography component="figcaption" variant="body2" sx={{ mt: 2, mb:2, textAlign: 'center', fontStyle: 'italic' }}>
            Cambiar la escala y mover el molde para ajustarlo a la línea de guía (en rojo), haciendo click y arrastrando las flechas de los vértices, apretando "Ctrl" para mantener las proporciones.  
            Consejo: Se puede hacer Zoom-In y Zoom-Out apretando "Ctrl" a la vez que se gira la rueda del ratón.
          </Typography>
        </Box>
      </Box>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        Borrar el trayecto de guía seleccionandolo y apretando "Supr", y utilizar la herramienta pluma para crear nodos en todos los vérices. 
        Se recomienda hacer zoom en la medida de lo necesario para lograr una mayor presición, apretando "Ctrl" + giro ruedita del mouse. Esto es útil tanto en la creación de nuevos nodos, como al editar curvas o arrastrar figuras.
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 0 }}>
        <Box component="figure" sx={{ m: 0, p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img 
            src={verticesImage} 
            alt="Poligono regular." 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
          <Typography component="figcaption" variant="body2" sx={{ mt: 2, mb:2, textAlign: 'center', fontStyle: 'italic' }}>
            Crear un polígono colocando nodos en todos los vértices del molde en la imágen de guía. Editar las líneas rectas para crear curvas es el próximo paso.
          </Typography>
        </Box>
      </Box>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        Sólo falta dar los últimos ajustes al molde con la herramienta de edición de nodos. Se pueden cambiar las coordenadas para alinear los puntos que estén sobre una misma línea horizontal, haciendo iguales sus coordenadas X. El mismo procedimiento se puede utilizar para alinear los puntos en el eje Y.
        Para hacer los lados curvos, se debe seleccionar la herramienta de edición de nodos y hacer doble click sobre la línea recta que se desee curvar. Apareceran dos círculos marcando los tiradores de nodos, los cuales se pueden arrastrar para ajustar la curvatura respecto de ambos vértices de la trayectoria que se esta editando.
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 0 }}>
        <Box component="figure" sx={{ m: 0, p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img 
            src={curvasImage} 
            alt="Creando curvas de Bezier." 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
          <Typography component="figcaption" variant="body2" sx={{ mt: 2, mb:2, textAlign: 'center', fontStyle: 'italic' }}>
            Los tiradores a nodos (curvatura) se marcan con un círculo y los nodos con un cuadrado. Se pueden arrastrar manteniendo apretado click para cambiar sus coordenadas, 
            o se pueden ingresar directamente las mismas desde la barra superior, seleccionando el nodo o tirador con la herramienta de edición, haciendoles click.
          </Typography>
        </Box>
      </Box>

      {/* Guardar */}
      <Typography variant="h6" component="h1" gutterBottom sx={{ mt: 4, textAlign: 'left' }}>
      <SectionTitle>
          ¿Cómo guardar mi molde?
      </SectionTitle>
      </Typography>
          
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        Cuando todo esté terminado, se debe borrar la imágen de fondo haciendole click con la herramienta "selector" y luego presionando "Supr". 
        ¡El molde digital está listo para ser guardado! Ir a "Archivo/Guardar Como...", darle un nombre al archivo del molde digital y seleccionar la extensión .SVG. 
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 0 }}>
        <Box component="figure" sx={{ m: 0, p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img 
            src={guardarImage} 
            alt="Guardar la imágen SVG." 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
          <Typography component="figcaption" variant="body2" sx={{ mt: 2, mb:2, textAlign: 'center', fontStyle: 'italic' }}>
            Guardar la imágen en formato ".svg"
          </Typography>
        </Box>
      </Box>

      {/*FIN DEL TUTORIAL */}    
      {/*FOOTER like/dislike */}    
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="body1" gutterBottom>
          ¿Te resultó útil este tutorial?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => handleFeedback('like')}
            color={feedback === 'like' ? 'primary' : 'default'}
            sx={{ opacity: feedback === 'dislike' ? 0.5 : 1 }}
          >
            <ThumbUpIcon />
          </IconButton>
          <IconButton 
            onClick={() => handleFeedback('dislike')}
            color={feedback === 'dislike' ? 'primary' : 'default'}
            sx={{ opacity: feedback === 'like' ? 0.5 : 1 }}
          >
            <ThumbDownIcon />
          </IconButton>
        </Box>
      </Box>
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>
          Contanos qué te gustaría aprender acerca de la digitalización de moldes
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Tu comentario"
            type="text"
            fullWidth
            variant="outlined"
            value={comment}
            onChange={handleCommentChange}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleSubmitComment} variant="contained">Enviar comentarios</Button>
        </DialogActions>
      </Dialog>
  </PageLayout>
  );
};

export default Tutorial;
