import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CartService } from '../header/cart.service'; // Actualiza la ruta según la ubicación real del servicio

@Component({
  selector: 'app-accesorios',
  standalone: true,
  templateUrl: './accesorios.component.html',
  styleUrls: ['./accesorios.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [HttpClient]
})
export class AccesoriosComponent implements OnInit {
  accesorios: any[] = [];
  filteredAccesorios: any[] = [];
  searchTerm = '';
  selectedCategorias: string[] = [];
  sortOrder = 'asc';
  minPrice = 0;
  maxPrice = Infinity;
  categorias = ['casco', 'guantes', 'pegatinas', 'escape', 'monos'];
  
  constructor(private http: HttpClient, private cartService: CartService) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/api/accesorios').subscribe(
      data => {
        this.accesorios = data;
        this.filteredAccesorios = data;
      },
      error => {
        console.error('Error al obtener los accesorios:', error);
      }
    );
  }

  applyFilters() {
    this.filteredAccesorios = this.accesorios
      .filter(accesorio => this.selectedCategorias.length === 0 || this.selectedCategorias.includes(accesorio.categoria))
      .filter(accesorio => accesorio.precio >= this.minPrice && accesorio.precio <= (this.maxPrice === 0 ? Infinity : this.maxPrice))
      .filter(accesorio => accesorio.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .sort((a, b) => this.sortOrder === 'asc' ? a.precio - b.precio : b.precio - a.precio);
  }

  onCategoriaChange(categoria: string, event: any) {
    if (event.target.checked) {
      this.selectedCategorias.push(categoria);
    } else {
      this.selectedCategorias = this.selectedCategorias.filter(c => c !== categoria);
    }
    this.applyFilters();
  }

  addToCart(accesorio: any) {
    this.cartService.addToCart(accesorio); // Añadir el accesorio al carrito usando el servicio
    console.log('Añadido al carrito:', accesorio);
  }
}
