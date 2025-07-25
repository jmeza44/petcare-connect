import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pet-search-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    <div
      class="group flex w-auto items-center gap-x-3 rounded-xl border border-gray-300 bg-white px-4 py-2 focus-within:border-gray-400 hover:border-gray-400"
    >
      <!-- Search Icon -->
      <svg
        class="h-5 w-5 text-gray-300 group-focus-within:text-gray-400 group-hover:text-gray-400"
        fill="currentColor"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
        />
      </svg>

      <!-- Input -->
      <input
        class="flex-grow cursor-text border-none bg-transparent text-gray-700 placeholder-gray-300 outline-none group-focus-within:placeholder-gray-400 group-hover:placeholder-gray-400"
        placeholder="Search..."
        type="text"
        aria-label="Buscar"
      />

      <!-- Close Icon -->
      <svg
        class="h-5 w-5 cursor-pointer text-gray-300 group-focus-within:text-gray-400 group-hover:text-gray-400"
        fill="currentColor"
        viewBox="0 0 384 512"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
        />
      </svg>
    </div>
  `,
})
export class SearchBarComponent {}
