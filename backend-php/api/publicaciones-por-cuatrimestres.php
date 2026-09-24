<?php
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../models/Publicacion.php';

$pagina = isset($_GET['page']) ? (int) $_GET['page'] : 1;
$limite = 9;
$offset = ($pagina - 1) * $limite;

$cuatrimestre = $_GET['cuatrimestre'] ?? null;
$anio         = isset($_GET['anio']) ? (int) $_GET['anio'] : null;

$publicacionModel = new Publicacion();

$publicaciones            = $publicacionModel->obtenerPaginadas($limite, $offset, $cuatrimestre, $anio);
$cuatrimestresDisponibles = $publicacionModel->obtenerCuatrimestresDisponibles();

header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'success'             => true,
    'data'                => $publicaciones,
    'filtros_disponibles' => $cuatrimestresDisponibles,
]);
