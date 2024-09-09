<script lang="ts" setup>

    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import { toast } from 'vue3-toastify';
    import { GeneralCat } from '@/models/GeneralCat';
    import { generalCatService } from '@/services/generalCatServices';
    import { Tooltip } from 'bootstrap';
    import { computed } from 'vue';

    // Form inputs
    const code = ref('');
    const type = ref('');
    const name = ref('');
    // Arrays
    let generalCat = ref<GeneralCat[]>([]);
    // Selected catalog
    let selectedCat = ref<GeneralCat | null>(null);
    // Tooltip
    const tooltipButton = ref<HTMLElement | null>(null);
    // search filter
    const searchQuery = ref('');
    // Paginate
    const currentPage = ref(1);
    const itemsPerPage = ref(5);

    onMounted(() => {
        if (tooltipButton.value) {
            new Tooltip(tooltipButton.value);
        }
        getGeneralCat();
    });

    async function handleSubmit() {
        try {
            const generalCatData: GeneralCat = {
                code: code.value,
                type: type.value,
                name: name.value,
                status: 'ACTIVO'
            };
            if (selectedCat.value?.id) {
                await generalCatService.updateCat(selectedCat.value.id, generalCatData);
                toast.success(`¡El catálogo ${generalCatData.name} se editó exitosamente!`);
            } else {
                console.log(generalCatData)
                await generalCatService.addCat(generalCatData);
                toast.success(`¡El catálogo ${generalCatData.name} se agregó exitosamente!`);
            }
            await getGeneralCat();
            formReset();
        } catch (error) {
            toast.error(`Error al agregar el catálogo ${name.value}.`);
        }
    }

    async function getGeneralCat() {
        try {
            generalCat.value = await generalCatService.getCatalogs();
            if (tooltipButton.value) {
                new Tooltip(tooltipButton.value);
            }
        } catch (error) {
            console.error('Error al obtener los catálogos:', error);
        }
    }

    function editGeneralCat(cat: GeneralCat) {
        selectedCat.value = cat;
        code.value = cat.code;
        type.value = cat.type;
        name.value = cat.name;
    }

    async function editStatus(id: number, status: string) {
        try {
            if(status == "ACTIVO") status = "INACTIVO";
            else status = "ACTIVO";

            await generalCatService.editStatus(id, status);
            await getGeneralCat();
        } catch (error) {
            toast.error(`Error al cambiar el estado del catálogo ${name.value}.`);
        }
    }

    async function deleteGeneralCat(id: number) {
        try {
            await generalCatService.deleteCat(id);
            toast.success(`El catálogo ${name.value} es eliminado exitosamente`);
            await getGeneralCat();
        } catch (error) {
            toast.error(`Error al eliminar el catálogo ${name.value}.`);
        }
    }

    const filteredGeneralCatalogs = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return generalCat.value.filter((generalCat) =>
            generalCat.name.toLowerCase().includes(query)
        );
    });

    const paginatedCatalogs = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        return filteredGeneralCatalogs.value.slice(startIndex, endIndex);
    });

    const totalPages = computed(() =>
        Math.ceil(filteredGeneralCatalogs.value.length / itemsPerPage.value)
    );

    function handlePageChange(page: number) {
        currentPage.value = page;
    }

    function formReset() {
        code.value = '';
        type.value = '';
        name.value = '';
        selectedCat.value = null;
    }

</script>

<template>
    <nav class="navbar">
        <div class="container-fluid">
            <a class="navbar-brand mb-0 h1">
                <h3><i class="fa-solid fa-person"></i>&nbsp;Catálogo general</h3>
            </a>
            <div class="login__field" data-bs-toggle="tooltip" data-bs-placement="top" title="Buscar por nombre del catálogo" ref="tooltipButton">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" v-model="searchQuery" class="login__input me-2" placeholder="Ingresa nombre" />
            </div>
            <button type="button" class="btn btn-success btn-sm py-1" @click="formReset()" data-bs-toggle="modal" data-bs-target="#generalCatModal" >
                <div data-bs-toggle="tooltip" data-bs-placement="top" title="Agregar catálogo" ref="tooltipButton">
                    <i class="fa-solid fa-plus fa-sm"></i>&nbsp;Agregar
                </div>
            </button>
        </div>    
    </nav>
    <div class="container">
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-primary">
                    <tr>
                        <th scope="col">Code</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Estatus</th>
                        <th scope="col" class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="paginatedCatalogs.length > 0" v-for="(catalog, index) in paginatedCatalogs" :key="catalog.id">
                        <td>{{ catalog.code }}</td>
                        <td>{{ catalog.type }}</td>
                        <td>{{ catalog.name }}</td>
                        <td> 
                            <div data-bs-toggle="tooltip" data-bs-placement="top" title="Cambiar Estatus" ref="tooltipButton">                         
                                <div class="form-check form-switch" v-if="catalog.status == 'ACTIVO'">
                                    <input class="form-check-input bg-success" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked @click="editStatus(catalog.id || 0, catalog.status)">                               
                                    <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                                </div>
                                <div class="form-check form-switch" v-else>
                                    <input class="form-check-input bg-danger" type="checkbox" role="switch" id="flexSwitchCheckDefault" @click="editStatus(catalog.id || 0, catalog.status)">                               
                                    <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                                </div>
                            </div> 
                        </td>
                        <td class="text-center">
                            <button class="btn btn-sm me-2" data-bs-toggle="modal" data-bs-target="#generalCatModal" @click="editGeneralCat(catalog)">
                                <div data-bs-toggle="tooltip" data-bs-placement="top" title="Editar catálogos" ref="tooltipButton">
                                    <i class="fa-solid fa-pen-to-square text-info"></i>
                                </div> 
                            </button>
                            <button v-if="catalog.id" type="button" class="btn btn-sm" @click="deleteGeneralCat(catalog.id)">
                                <div data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar catálogo" ref="tooltipButton">
                                    <i class="fa-solid fa-trash text-danger"></i>                                
                                </div>
                            </button>
                        </td>
                    </tr>
                    <tr v-else>
                        <td colspan="5" class="text-center">No hay productos registrados.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Pagination Controls -->
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="handlePageChange(currentPage - 1)">Anterior</a>
                </li>
                <li class="page-item" :class="{ active: currentPage === page }" v-for="page in totalPages" :key="page">
                    <a class="page-link" href="#" @click.prevent="handlePageChange(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="handlePageChange(currentPage + 1)">Siguiente</a>
                </li>
            </ul>
        </nav>
    </div>

    <div class="modal fade" id="generalCatModal" tabindex="-1" aria-labelledby="generalCatModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="generalCatModalLabel">
                        <i class="fa-solid fa-person"></i>&nbsp;&nbsp;{{ selectedCat ? 'Editar catálogo' : 'Agregar catálogo' }}
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body me-20">
                    <form @submit.prevent="handleSubmit" class="te-5">
                        <div class="mb-2">
                            <div class="login__field">
                                <i class="fa-solid fa-map-location-dot"></i>
                                <input type="text" id="code" placeholder="Code" class="login__input" v-model="code" required>
                            </div>
                        </div>
                        <div class="mb-1">
                            <div class="login__field">
                                <i class="fa-solid fa-location-crosshairs"></i>
                                <input type="text" id="type" placeholder="Type" v-model="type" class="login__input" required> 
                            </div>
                        </div>
                        <div class="mb-2">
                            <div class="login__field">
                                <i class="fa-solid fa-user-tag"></i>                  
                                <input type="text" id="name" placeholder="Name" v-model="name" class="login__input" required>
                            </div>
                        </div>
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button type="submit" class="btn btn-sm btn-success"><div data-bs-toggle="tooltip" data-bs-placement="top" title="Guardar catálogo" ref="tooltipButton"><i class="fa-solid fa-floppy-disk fa-sm"></i> Guardar</div></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .table {
        margin-top: 20px;
    }
</style>