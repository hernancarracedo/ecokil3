-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 30-03-2020 a las 02:26:23
-- Versión del servidor: 5.5.24-log
-- Versión de PHP: 5.4.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `my_schema`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE IF NOT EXISTS `cliente` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `tx_cliente` varchar(100) NOT NULL,
  `id_tipo_cliente` int(11) NOT NULL,
  `observaciones` varchar(200) NOT NULL,
  `fecha_alta` date NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `baja` date DEFAULT NULL,
  PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id_cliente`, `tx_cliente`, `id_tipo_cliente`, `observaciones`, `fecha_alta`, `id_usuario`, `baja`) VALUES
(1, 'Banco Hipotecario', 1, '', '2019-04-01', 1, NULL),
(2, 'Club Santafesino', 1, '', '2019-06-03', 1, NULL),
(3, 'Casi Rodriguez SRL', 1, '', '2019-07-01', 1, NULL),
(4, 'Petrohard Srl', 1, '', '2019-08-01', 1, NULL),
(5, 'Paula Otero', 4, 'Barrilo Los Olivos', '2019-06-01', 1, NULL),
(6, 'Dublin Resto Bar', 4, '', '2019-11-01', 1, NULL),
(7, 'CURLO SRL', 2, '', '2019-04-01', 1, NULL),
(8, 'Otero e hijas SRL', 2, 'Optica Sarmiento', '2019-04-01', 1, NULL),
(9, 'Panificadora Quimey', 5, '', '2019-11-01', 1, NULL),
(10, 'Daniel Gonzalez', 2, '20-14270401-4 Resp Insc (Frigorifico en Clte Cordero)', '2019-11-01', 1, NULL),
(11, 'Mariel (pinos)', 5, '', '2019-10-01', 1, NULL),
(12, 'Valeria Guillibran', 5, '', '2019-11-01', 1, NULL),
(13, 'Mariela Herzig', 5, 'casa barrio Rincon de Emilio', '2019-11-01', 1, NULL),
(14, 'Alejandro Perez', 5, 'Casa barrio Rincon Club de Campo', '2019-11-01', 1, NULL),
(15, 'DRC Milanesas', 5, '', '2019-11-01', 1, NULL),
(16, 'Christian Gatica', 5, 'Casa en calle Egipto (Rincon de Emilio)', '2019-11-01', 1, NULL),
(17, 'Consorcio Edificio Villa Dolores', 2, 'cuit 30-71136510-5', '2019-11-01', 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente_tipo`
--

CREATE TABLE IF NOT EXISTS `cliente_tipo` (
  `id_tipo_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `tx_tipo_cliente` varchar(50) NOT NULL,
  `baja` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_tipo_cliente`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Volcado de datos para la tabla `cliente_tipo`
--

INSERT INTO `cliente_tipo` (`id_tipo_cliente`, `tx_tipo_cliente`, `baja`) VALUES
(1, 'Abono Mensual (F)', NULL),
(2, 'Eventual (F)', NULL),
(3, 'Prospect', NULL),
(4, 'Abono Mensual (SF)', NULL),
(5, 'Eventual (SF)', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contacto`
--

CREATE TABLE IF NOT EXISTS `contacto` (
  `id_contacto` int(11) NOT NULL AUTO_INCREMENT,
  `tx_contacto` varchar(100) NOT NULL,
  `id_tipo_contacto` int(11) NOT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `mail` varchar(70) NOT NULL,
  `celular` varchar(20) NOT NULL,
  `telefono2` varchar(20) NOT NULL,
  `observaciones` varchar(300) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `baja` date DEFAULT NULL,
  PRIMARY KEY (`id_contacto`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Volcado de datos para la tabla `contacto`
--

INSERT INTO `contacto` (`id_contacto`, `tx_contacto`, `id_tipo_contacto`, `id_cliente`, `mail`, `celular`, `telefono2`, `observaciones`, `id_usuario`, `baja`) VALUES
(1, 'Daniel Gonzalez', 1, 10, 'dgonzalez@simetra.com.ar', '', '', '', 1, NULL),
(2, 'Maximiliano Recchioni', 1, 0, 'maximiliano.recchioni@ar.mcd.com', '', '', 'Franquicia Mc Donalds Neuquen', 1, NULL),
(3, 'Fabian Gauna', 5, 2, 'fabian1.gauna@gmail.com', '', '', 'Presidente Club Santa', 1, NULL),
(4, 'Marcelo Gonzalez', 1, 3, 'mpgonzalez.51@gmail.com', '', '', '', 1, NULL),
(5, 'Carlos Acuña', 5, 0, 'caacuna@dfaneuquen.com', '', '', 'Deposito Fiscal y Aduanero del Neuquen', 1, NULL),
(6, 'Rodolfo Collazo', 5, 0, 'rodolfo.collazo@ocasa.com', '', '', 'OCASA', 1, NULL),
(7, 'Victor Lovera', 1, 0, 'aipatagonico@hotmail.com', '', '', '', 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contacto_tipo`
--

CREATE TABLE IF NOT EXISTS `contacto_tipo` (
  `id_tipo_contacto` int(11) NOT NULL AUTO_INCREMENT,
  `tx_tipo_contacto` varchar(40) NOT NULL,
  `baja` date DEFAULT NULL,
  PRIMARY KEY (`id_tipo_contacto`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Volcado de datos para la tabla `contacto_tipo`
--

INSERT INTO `contacto_tipo` (`id_tipo_contacto`, `tx_tipo_contacto`, `baja`) VALUES
(1, 'Dueño', NULL),
(2, 'Socio', NULL),
(3, 'Calidad', NULL),
(4, 'HSE', NULL),
(5, 'Gerente', NULL),
(6, 'Empleado', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documento`
--

CREATE TABLE IF NOT EXISTS `documento` (
  `id_docu` int(11) NOT NULL AUTO_INCREMENT,
  `tx_docu` varchar(50) NOT NULL,
  `id_docu_tipo` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `ruta_docu` varchar(80) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `observaciones` varchar(200) NOT NULL,
  `baja` date DEFAULT NULL,
  PRIMARY KEY (`id_docu`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Volcado de datos para la tabla `documento`
--

INSERT INTO `documento` (`id_docu`, `tx_docu`, `id_docu_tipo`, `id_cliente`, `fecha`, `ruta_docu`, `id_usuario`, `observaciones`, `baja`) VALUES
(1, 'post de ig', 2, 11, '2022-12-05', '/uploads/documentos/cerezas.jpg', 1, 'factura noviembre', NULL),
(2, 'presupusupusupu', 1, 15, '2019-12-13', '/uploads/documentos/d6aaa2d09290365\r\n2a2225a54ac7a8a03', 1, 'presupuesto 666', NULL),
(3, 'logo ecokil', 2, 3, '2019-12-09', '/uploads/documentos/25f909257a767e0dee14e8809ea9eb6a', 1, 'factura noviembre', '2019-12-09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documento_tipo`
--

CREATE TABLE IF NOT EXISTS `documento_tipo` (
  `id_docu_tipo` int(11) NOT NULL AUTO_INCREMENT,
  `tx_docu_tipo` varchar(60) NOT NULL,
  `baja` date DEFAULT NULL,
  PRIMARY KEY (`id_docu_tipo`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Volcado de datos para la tabla `documento_tipo`
--

INSERT INTO `documento_tipo` (`id_docu_tipo`, `tx_docu_tipo`, `baja`) VALUES
(1, 'Presupuesto', NULL),
(2, 'Contrato', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gasto`
--

CREATE TABLE IF NOT EXISTS `gasto` (
  `id_gasto` int(11) NOT NULL AUTO_INCREMENT,
  `id_tipo` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `observaciones` varchar(200) NOT NULL,
  `monto` decimal(11,2) NOT NULL,
  `id_billetera` int(11) NOT NULL,
  `id_forma_pago` int(11) NOT NULL,
  `vencimiento` varchar(10) DEFAULT NULL,
  `baja` date DEFAULT NULL,
  PRIMARY KEY (`id_gasto`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Volcado de datos para la tabla `gasto`
--

INSERT INTO `gasto` (`id_gasto`, `id_tipo`, `fecha`, `observaciones`, `monto`, `id_billetera`, `id_forma_pago`, `vencimiento`, `baja`) VALUES
(1, 1, '2019-11-01', 'factura de luz 222', '550.76', 1, 1, '2020', NULL),
(2, 2, '2019-11-25', 'Honorarios Contadora', '3000.00', 1, 1, '2019-09-17', NULL),
(3, 2, '2019-11-20', 'factura noviembre', '678.08', 1, 1, 'venc 11/11', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gasto_billetera`
--

CREATE TABLE IF NOT EXISTS `gasto_billetera` (
  `id_billetera` int(11) NOT NULL AUTO_INCREMENT,
  `tx_billetera` varchar(30) NOT NULL,
  `baja` date DEFAULT NULL,
  PRIMARY KEY (`id_billetera`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Volcado de datos para la tabla `gasto_billetera`
--

INSERT INTO `gasto_billetera` (`id_billetera`, `tx_billetera`, `baja`) VALUES
(1, 'Pago Guada', NULL),
(2, 'Pago Santi', NULL),
(3, 'Pago Ecokil', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gasto_forma_pago`
--

CREATE TABLE IF NOT EXISTS `gasto_forma_pago` (
  `id_forma_pago` int(11) NOT NULL AUTO_INCREMENT,
  `tx_forma_pago` varchar(30) NOT NULL,
  `baja` date DEFAULT NULL,
  PRIMARY KEY (`id_forma_pago`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Volcado de datos para la tabla `gasto_forma_pago`
--

INSERT INTO `gasto_forma_pago` (`id_forma_pago`, `tx_forma_pago`, `baja`) VALUES
(1, 'EFECTIVO', NULL),
(2, 'TRANSFERENCIA', NULL),
(3, 'PAGO MIS CUENTAS', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gasto_grupo`
--

CREATE TABLE IF NOT EXISTS `gasto_grupo` (
  `id_grupo` int(11) NOT NULL AUTO_INCREMENT,
  `tx_grupo` varchar(30) NOT NULL,
  `baja` date DEFAULT NULL,
  PRIMARY KEY (`id_grupo`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Volcado de datos para la tabla `gasto_grupo`
--

INSERT INTO `gasto_grupo` (`id_grupo`, `tx_grupo`, `baja`) VALUES
(1, 'Servicios', NULL),
(2, 'Impuestos', NULL),
(3, 'Proveedores', NULL),
(4, 'Honorarios', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gasto_tipo`
--

CREATE TABLE IF NOT EXISTS `gasto_tipo` (
  `id_tipo` int(11) NOT NULL AUTO_INCREMENT,
  `tx_tipo` varchar(40) NOT NULL,
  `id_grupo` int(11) NOT NULL,
  `baja` date DEFAULT NULL,
  PRIMARY KEY (`id_tipo`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Volcado de datos para la tabla `gasto_tipo`
--

INSERT INTO `gasto_tipo` (`id_tipo`, `tx_tipo`, `id_grupo`, `baja`) VALUES
(1, 'CALF', 1, NULL),
(2, 'Tel Celular', 1, NULL),
(3, 'Telefono Fijo', 1, NULL),
(4, 'Jubilac Autonomos', 2, NULL),
(5, 'Ingresos Brutos', 2, NULL),
(6, 'Sellados', 2, NULL),
(7, 'IVA', 2, NULL),
(8, 'Ganancias', 2, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movibanco`
--

CREATE TABLE IF NOT EXISTS `movibanco` (
  `id_movibanco` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `nro_comprob` varchar(20) NOT NULL,
  `id_movibanco_concepto` int(11) NOT NULL,
  `concepto` varchar(150) NOT NULL,
  `referencia` varchar(30) NOT NULL,
  `saldo` decimal(10,2) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `observaciones` varchar(100) NOT NULL,
  `baja` date DEFAULT NULL,
  PRIMARY KEY (`id_movibanco`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Volcado de datos para la tabla `movibanco`
--

INSERT INTO `movibanco` (`id_movibanco`, `fecha`, `monto`, `nro_comprob`, `id_movibanco_concepto`, `concepto`, `referencia`, `saldo`, `id_usuario`, `observaciones`, `baja`) VALUES
(1, '2019-11-20', '550.75', '-', 0, 'Deposito', 'ref4', '550.75', 1, 'daniel gonzalez abono', NULL),
(2, '2019-11-13', '-666.66', '7373', 7, '', '', '3500.01', 1, 'factura camuzzi', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movibanco_concepto`
--

CREATE TABLE IF NOT EXISTS `movibanco_concepto` (
  `id_movibanco_concepto` int(11) NOT NULL AUTO_INCREMENT,
  `tx_movibanco_concepto` varchar(50) NOT NULL,
  `baja` date DEFAULT NULL,
  PRIMARY KEY (`id_movibanco_concepto`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Volcado de datos para la tabla `movibanco_concepto`
--

INSERT INTO `movibanco_concepto` (`id_movibanco_concepto`, `tx_movibanco_concepto`, `baja`) VALUES
(1, 'ACRE.CH.OTR. BCOS P/CTA PROPIA', NULL),
(2, 'CAUT TRANSF. INTERBANCARIA', NULL),
(3, 'CHEQ RECHAZADO ENT DEP', NULL),
(4, 'COMIS.AUT.MANT.DE CUENTA', NULL),
(5, 'COMISION VALOR AL COBRO', NULL),
(6, 'DEB.DIR.', NULL),
(7, 'DEBITO IVA', NULL),
(8, 'EXTR.EFVO X CAUT/CAJA (T.DBTO)', NULL),
(9, 'IMP.DEBITOS BANCARIOS', NULL),
(10, 'IMPUESTO AL CREDITO', NULL),
(11, 'TRF INMEDIAT', NULL),
(12, 'TRF INTERBAN', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movicc`
--

CREATE TABLE IF NOT EXISTS `movicc` (
  `id_movicc` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_movicc_tipo_comprobante` int(11) NOT NULL,
  `nro_comprobante` varchar(15) NOT NULL,
  `id_movicc_formapago` int(11) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  `observaciones` varchar(150) NOT NULL,
  `baja` date DEFAULT NULL,
  PRIMARY KEY (`id_movicc`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Volcado de datos para la tabla `movicc`
--

INSERT INTO `movicc` (`id_movicc`, `fecha`, `monto`, `id_cliente`, `id_movicc_tipo_comprobante`, `nro_comprobante`, `id_movicc_formapago`, `id_usuario`, `observaciones`, `baja`) VALUES
(1, '2019-11-30', '-2500.00', 2, 1, 'B00001-0000007', NULL, 1, 'factura noviembre', NULL),
(2, '2019-11-01', '4500.00', 2, 2, 'REC001-000017', 0, 1, 'Cancelacion factura noviembre', NULL),
(3, '2019-12-26', '7000.00', 2, 2, 'REC001-000018', 2, 1, 'Abono Octubre', '2019-12-08'),
(4, '2019-12-16', '-3000.00', 2, 2, 'REC001-000019', 4, 1, 'factura noviembre', NULL),
(5, '2019-08-13', '-1877.00', 12, 3, 'ND-001-00055', NULL, 1, 'fumigacion x 3', NULL),
(6, '2019-08-13', '-1978.00', 16, 3, 'ND-001-00013', NULL, 1, 'factura noviembre', '2019-12-08'),
(7, '2019-12-14', '2500.00', 16, 2, 'REC001-000022', 1, 1, 'serv', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movicc_formapago`
--

CREATE TABLE IF NOT EXISTS `movicc_formapago` (
  `id_movicc_formapago` int(11) NOT NULL AUTO_INCREMENT,
  `tx_movicc_formapago` varchar(30) NOT NULL,
  `baja` date DEFAULT NULL,
  PRIMARY KEY (`id_movicc_formapago`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Volcado de datos para la tabla `movicc_formapago`
--

INSERT INTO `movicc_formapago` (`id_movicc_formapago`, `tx_movicc_formapago`, `baja`) VALUES
(1, 'Efectivo', NULL),
(2, 'Transferencia', NULL),
(3, 'Cheque', NULL),
(4, 'Compensacion', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movicc_tipo_comprobante`
--

CREATE TABLE IF NOT EXISTS `movicc_tipo_comprobante` (
  `id_movicc_tipo_comprobante` int(11) NOT NULL,
  `tx_movicc_tipo_comprobante` varchar(30) NOT NULL,
  `tipo_mov` varchar(1) NOT NULL,
  `baja` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `movicc_tipo_comprobante`
--

INSERT INTO `movicc_tipo_comprobante` (`id_movicc_tipo_comprobante`, `tx_movicc_tipo_comprobante`, `tipo_mov`, `baja`) VALUES
(1, 'FACTURA', 'd', NULL),
(2, 'RECIBO', 'p', NULL),
(3, 'NOTA DEBITO', 'd', NULL),
(4, 'NOTA CREDITO', 'p', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal`
--

CREATE TABLE IF NOT EXISTS `personal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `url_img_perfil` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Volcado de datos para la tabla `personal`
--

INSERT INTO `personal` (`id`, `nombre`, `apellido`, `url_img_perfil`) VALUES
(1, 'Santiago', 'Rodriguez', 'img/perfil/santiago.jpg'),
(2, 'Guadalupe', 'Rodriguez', 'img/perfil/guadalupe.jpg'),
(3, 'Nicolas', 'Guerci', 'img/perfil/nicolas.jpg'),
(4, 'Cristina', 'Ganemn', 'img/perfil/cristina.jpg'),
(5, 'Hernan', 'Carracedo', 'img/perfil/hernan.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarea`
--

CREATE TABLE IF NOT EXISTS `tarea` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `personal_id` int(5) DEFAULT NULL,
  `relevancia_tarea_id` int(2) DEFAULT NULL,
  `vencimiento` date DEFAULT NULL,
  `estado_tarea_id` int(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

--
-- Volcado de datos para la tabla `tarea`
--

INSERT INTO `tarea` (`id`, `nombre`, `descripcion`, `personal_id`, `relevancia_tarea_id`, `vencimiento`, `estado_tarea_id`) VALUES
(1, 'Emitir Factura Gonzalez', 'ver datos con Gallego emitir y enviar factura por Frigorifico', 2, 2, '2019-11-22', 3),
(2, 'Presupuesto a Distribuidora Centenario', 'Corregir borrador Santi y enviar mail', 2, 1, '2019-11-20', 3),
(3, 'Contactar a Gatica Christian', 'llamar para explicar el servicio y pasar precio a domicilio Rincon de Emilio', 1, 1, '2019-11-20', 3),
(4, 'Presupuesto a Marido de Laura Gardez', 'Presupuesto por tratamiento de Hormigas en loteo', 1, 1, '2019-11-20', 3),
(5, 'Cobrar a Paula Otero ', 'cobrar el servicio de primeros dia noviembre', 1, 2, '2019-11-22', 1),
(6, 'Llevar factura a Casi Rodriguez', 'llevar factura de moviembre a Casi Rodiguez', 1, 2, '2019-11-22', 1),
(7, 'Llamar contacto Pranzo ', 'llamar al de la fabrica de empanadas de Allen. el contacto que paso claudio Moretti', 1, 1, '2019-11-21', 1),
(8, 'llevar carpeta a ChaCoo SRL', 'llevar a carpeta es en zona aeropuerto, Distribucion de pollos', 1, 2, '2019-11-26', 3),
(9, 'Croquis Frigorifico Gonzalez', 'Enviarle para senasa a Daniel Gonzalez croquis posicion de estaciones de monitoreo', 1, 1, '2019-11-21', 3),
(10, 'Chequear que opina de 2 presupuesto Agroinsumos', 'llamar al cliente para ver si recibio el mail y si el precio se ajusta o si no lo puede pagar o que va hacer', 1, 3, '2019-11-25', 1),
(11, 'visita a cotillon siglo xxi', 'ir a presupuestar', 1, 1, '2019-11-22', 3),
(12, 'prespuesto Siglo XXI', 'presupuesto por mail a cotillon siglo XXI', 1, 1, '2019-11-25', 3),
(13, 'tarea de prueba', 'arandela galavanizada 3/8', 5, 1, '2019-11-06', 4),
(14, 'propuesta a Moño azul', 'enviar o llevar propuesta al de moño azul visitado en la semana', 1, 1, '2019-11-25', 1),
(15, 'llamar a Jorro', 'hablar por hoteles y posibles clientes suyos con sucursal en nqn', 2, 2, '2019-11-27', 3),
(16, 'Responder mail Hidroner', 'tratar de arreglar para verlo y presupuestar lo que pide', 1, 1, '2019-11-27', 1),
(17, 'Facturar Noviembre Petrohard', 'hacer y enviar factura del mes de noviembre', 2, 1, '2019-11-28', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarea_estado`
--

CREATE TABLE IF NOT EXISTS `tarea_estado` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tx_tarea_estado` varchar(50) NOT NULL,
  `css` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Volcado de datos para la tabla `tarea_estado`
--

INSERT INTO `tarea_estado` (`id`, `tx_tarea_estado`, `css`) VALUES
(1, 'PENDIENTE', 'bg-success'),
(2, 'DEMORADO', 'bg-danger'),
(3, 'CUMPLIDO', 'bg-primary'),
(4, 'CANCELADO', 'bg-warning	\n');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarea_relevancia`
--

CREATE TABLE IF NOT EXISTS `tarea_relevancia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tx_tarea_relevancia` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Volcado de datos para la tabla `tarea_relevancia`
--

INSERT INTO `tarea_relevancia` (`id`, `tx_tarea_relevancia`) VALUES
(1, 'ALTA'),
(2, 'MEDIA'),
(3, 'BAJA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(21) NOT NULL,
  `password` char(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'hernanpampa@gmail.com', '$2a$10$WTuhVrqdklQJrn./X4wZJ.0n8OXPmjz.IjCnrjHMkrT4uDMNhdbcm'),
(3, 'tren222', '$2a$10$T0Yp3a2yVDopT2sOIfg44OnS5pJXZOu4HdxQel17z1Wc.g4FUH7bO'),
(4, 'hernan@gmail.com', '$2a$10$xDlLUquM2h5eYR3Yhg31GOtyQyeoFea2t9ZIqwNRF3uRzaJZPIjKy'),
(5, 'tren', '$2a$10$dBV1Og8L/sRHvJiyNYy72.ls0vOQsfsw778oNVrL7PnDi8hsYnQKS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visitamip`
--

CREATE TABLE IF NOT EXISTS `visitamip` (
  `id_visitamip` int(11) NOT NULL AUTO_INCREMENT,
  `id_tipo_visitamip` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `remito` varchar(20) NOT NULL,
  `observaciones` varchar(300) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `baja` date DEFAULT NULL,
  PRIMARY KEY (`id_visitamip`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Volcado de datos para la tabla `visitamip`
--

INSERT INTO `visitamip` (`id_visitamip`, `id_tipo_visitamip`, `fecha`, `id_cliente`, `remito`, `observaciones`, `id_usuario`, `baja`) VALUES
(1, 2, '2019-09-19', 1, '111111', 'bla bla bla', 1, '2019-11-20'),
(2, 1, '2019-11-05', 2, '13131313', 'le le le le', 1, NULL),
(3, 1, '2019-11-07', 1, '545454', 'primero cargado por user 1', 1, NULL),
(4, 1, '2019-11-21', 2, '77997799', 'probando archivo', 1, NULL),
(5, 1, '2019-11-07', 1, '77997799', 'segundo prueba file', 1, NULL),
(6, 3, '2019-11-14', 6, '566565656', 'tercer intento', 1, NULL),
(7, 1, '2019-11-21', 15, '545454', '4to', 1, NULL),
(8, 2, '2019-11-06', 8, '545454', '5to', 1, NULL),
(9, 2, '2019-11-13', 1, '545454', 'funcionando 1ro', 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visitamip_tipo`
--

CREATE TABLE IF NOT EXISTS `visitamip_tipo` (
  `id_tipo_visitamip` int(11) NOT NULL AUTO_INCREMENT,
  `tx_tipo_visitamip` varchar(50) NOT NULL,
  `baja` date DEFAULT NULL,
  PRIMARY KEY (`id_tipo_visitamip`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Volcado de datos para la tabla `visitamip_tipo`
--

INSERT INTO `visitamip_tipo` (`id_tipo_visitamip`, `tx_tipo_visitamip`, `baja`) VALUES
(1, 'Inspeccion Cebadera', NULL),
(2, 'Fumigacion', NULL),
(3, 'Tratamiento Cucarachas', NULL),
(4, 'Tratamiento Hormigas', NULL);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
