import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.AccessDeniedException;

@GetMapping
public List<ProductoResponse> listar(
        @RequestParam(required = false) Long categoriaId,
        @RequestParam(required = false) String q,
        @RequestParam(defaultValue = "false") boolean incluirInactivos,
        Authentication authentication) {
    if (incluirInactivos && !esAdministrador(authentication)) {
        throw new AccessDeniedException("Solo el administrador puede ver productos inactivos");
    }
    return productoService.buscar(categoriaId, q, incluirInactivos);
}

@PostMapping
@ResponseStatus(HttpStatus.CREATED)
@PreAuthorize("hasRole('ADMINISTRADOR')")
public ProductoResponse crear(@Valid @RequestBody ProductoRequest request) {
    return productoService.crear(request);
}

@PutMapping("/{id}")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public ProductoResponse actualizar(@PathVariable Long id,
        @Valid @RequestBody ProductoRequest request) {
    return productoService.actualizar(id, request);
}

@DeleteMapping("/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT)
@PreAuthorize("hasRole('ADMINISTRADOR')")
public void eliminar(@PathVariable Long id) {
    productoService.eliminar(id);
}

@GetMapping("/{id}")
public ProductoResponse obtener(@PathVariable Long id, Authentication authentication) {
    ProductoResponse producto = productoService.obtenerPorId(id);
    if (!producto.isActivo() && !esAdministrador(authentication)) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
    }
    return producto;
}

private boolean esAdministrador(Authentication auth) {
    return auth != null && auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
}
