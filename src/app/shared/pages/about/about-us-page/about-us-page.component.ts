import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pet-about-us-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-auto max-w-4xl px-4 py-10">
      <section class="mb-12 text-center">
        <h1 class="mb-4 text-4xl font-semibold text-gray-800">
          ¿Quiénes somos?
        </h1>
        <p class="text-lg text-gray-600">
          <strong>PetCare Connect</strong> es una plataforma integral diseñada
          para mejorar la gestión de la adopción, el cuidado y la educación
          sobre el bienestar animal. Nuestro objetivo es conectar de manera
          efectiva a adoptantes con refugios y fundaciones, facilitando el
          seguimiento de la salud de las mascotas, ofreciendo recursos
          educativos y permitiendo consultas veterinarias remotas.
        </p>
      </section>

      <section class="mb-12">
        <h2 class="mb-6 text-2xl font-semibold text-gray-800">
          Nuestra Misión
        </h2>
        <p class="text-lg text-gray-600">
          A través de la combinación de tecnología y un enfoque compasivo,
          PetCare Connect busca mejorar la vida de los animales y las personas
          que se preocupan por ellos. Ofrecemos recursos, apadrinamiento, y
          servicios que permiten una adopción responsable y el bienestar animal.
        </p>
      </section>

      <section class="mb-12">
        <h2 class="mb-6 text-2xl font-semibold text-gray-800">
          Nuestra Visión
        </h2>
        <p class="text-lg text-gray-600">
          Transformar la manera en que las personas se conectan con los
          refugios, brindando una red de apoyo para asegurar el bienestar de los
          animales y fomentar la adopción responsable.
        </p>
      </section>

      <section>
        <h2 class="mb-6 text-2xl font-semibold text-gray-800">
          Nuestro Público Objetivo
        </h2>
        <p class="text-lg text-gray-600">
          Nos enfocamos en adoptantes, refugios, fundaciones, veterinarios,
          padrinos, donantes y marcas comprometidas con el bienestar animal.
        </p>
      </section>
    </div>
  `,
})
export class AboutUsPageComponent {}
