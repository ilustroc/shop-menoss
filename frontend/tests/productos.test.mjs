import { test } from "node:test";
import assert from "node:assert/strict";
import {
  IMAGEN_POR_DEFECTO,
  aCuerpoApi,
  aInput,
  aProducto,
} from "../src/services/productoMapper.ts";

const respuesta = {
  id: 7,
  nombre: "Arroz Costeño 5kg",
  descripcion: null,
  precio: 24.9,
  stock: 12,
  imagenUrl: null,
  activo: true,
  categoriaId: 3,
  categoriaNombre: "Abarrotes",
};

test("La respuesta del backend se adapta al producto de la tienda", () => {
  const p = aProducto(respuesta);
  assert.equal(p.categoria, "Abarrotes");
  assert.equal(p.categoriaId, 3);
  assert.equal(p.descripcion, "");
  assert.equal(p.imagen, IMAGEN_POR_DEFECTO);
  assert.equal(
    aProducto({ ...respuesta, imagenUrl: "" }).imagen,
    IMAGEN_POR_DEFECTO,
  );
  assert.equal(
    aProducto({ ...respuesta, imagenUrl: "/images/products/arroz.jpg" }).imagen,
    "/images/products/arroz.jpg",
  );
  assert.equal(p.activo, true);
});

test("Al crear se envía categoriaId y el stock inicial", () => {
  const cuerpo = aCuerpoApi({
    nombre: "Leche",
    descripcion: "",
    precio: 4.2,
    imagen: "",
    categoriaId: 5,
    activo: true,
    stock: 20,
  });
  assert.equal(cuerpo.categoriaId, 5);
  assert.equal(cuerpo.stock, 20);
  assert.equal(cuerpo.imagenUrl, "");
  assert.equal("categoria" in cuerpo, false);
});

test("Al editar no se envía el stock, para no pisar cambios de pedidos o inventario", () => {
  const cuerpo = aCuerpoApi({
    nombre: "Leche",
    descripcion: "",
    precio: 4.2,
    imagen: "",
    categoriaId: 5,
    activo: true,
  });
  assert.equal("stock" in cuerpo, false);
});

test("Reactivar conserva los datos y no envía stock ni la imagen por defecto", () => {
  const input = aInput({ ...aProducto(respuesta), activo: false });
  assert.equal(input.categoriaId, 3);
  assert.equal(input.imagen, "");
  assert.equal(input.activo, false);
  assert.equal("stock" in input, false);
  assert.equal(aCuerpoApi({ ...input, activo: true }).activo, true);
  const conImagen = aInput(
    aProducto({ ...respuesta, imagenUrl: "/images/products/arroz.jpg" }),
  );
  assert.equal(conImagen.imagen, "/images/products/arroz.jpg");
});
