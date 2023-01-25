<script>
import {defineComponent} from 'vue'
import {getFirestore,setDoc,doc,collection,getDocs, updateDoc, arrayUnion, Timestamp} from 'firebase/firestore'
import {getStorage,ref,uploadBytes,getDownloadURL} from 'firebase/storage'
import Bannierre from '../components/Bannierre.vue'
import CateGorie from '../components/CateGorie.vue'
import ProDuct from '../components/ProDuct.vue'
import app from '../../fi'
  export default defineComponent ({
    name:'HomeView',
    components:{Bannierre,CateGorie,ProDuct},
    data(){
      return {
        active:'home',
        type:'categorie',
        FourName:'',
        FourLink:'',
        AllFour:[]

      }
    },
    
    methods:{
      changeMenu(x){
        if(x=='home'){
        this.type='categorie'
      }else if (x=='add product'){
        this.type='produit'
      }else if (x=='fournisseur'){
        this.type='fournisseur'
      }else if (x=='banniere'){
        this.type='banniere'
      }
      this.active=x
      },
     
      
   
    //les fonctions pour l'ajout des produits
   
    
    //les fonction pour l'ajout des fournisseur
   async saveFourLink(event){
    if(!event.target.files[0]){
                return
            }
      try {
        const storage = getStorage(app)
        const refFourPhoto = ref(storage, `Fournisseurs/${event.target.files[0].name}`)
        const snapshot = await uploadBytes(refFourPhoto,event.target.files[0])
        this.FourLink= await getDownloadURL(snapshot.ref)
        alert('photo enregistrer')
      } catch (error) {
        alert('non enregistrer')
      }
     
    },
    SaveFour(){
      if(this.FourName !='' && this.FourLink != ''){
        const db = getFirestore(app)
      const refFour = doc(collection(db,'FOURNISSEURS'))
      setDoc(refFour,{
        id:refFour.id,
        FourName:this.FourName,
        FourPhoto : this.FourLink
      })
      alert('enregistrer')
      this.FourName=''
       
      }
      
    }
  },
  })
</script>

<template>
 <nav>
        <ul class="nav nav-pills justify-content-center">
            <li class="nav-item" @click="changeMenu('home')">
              <a class="nav-link " :class="{ active: active=='home' }"  aria-current="page" href="#">AJouter une Categorie</a>
            </li>
            <li class="nav-item" @click="changeMenu('fournisseur')">
              <a class="nav-link" href="#" :class="{ active: active=='fournisseur' }">Ajouter un Four</a>
            </li>
            <li class="nav-item" @click="changeMenu('add product')">
              <a class="nav-link" href="#" :class="{ active: active=='add product' }">AJouter un produits</a>
            </li>
            <li class="nav-item" @click="changeMenu('banniere')">
              <a class="nav-link" href="#" :class="{ active: active=='banniere' }">AJouter une banniere</a>
            </li>
          
          </ul>
    </nav>
    <!--pour la categories-->
      <CateGorie v-if="type=='categorie'" />

    <!--pour l'ajout des produits-->
       <ProDuct  v-if="type=='produit'" />
    <!--pour l'ajout d'un fournisseur-->
    <div class="container" v-if="type=='fournisseur'">
     <div class="row">
      <div class="col-md-4">
        <div class="mb-3">
                <input type="text" v-model ="FourName" class="form-control" id="exampleFormControlInput1" placeholder="le nom du fournisseur">
              </div>
      </div>
      <div class="col-md-4">
        <div class="mb-3">
                <input type="file"  class="form-control" id="exampleFormControlInput1" placeholder="photo" @change="saveFourLink" accept="image/*">
              </div>
      </div>
     </div>
     <button class="btn btn-primary" @click="SaveFour()">fournisseur</button>
    </div>
    <!--pour ajout de bannier-->
   <Bannierre v-if="type=='banniere'" />
</template>
<style scoped>
nav{
  margin: 10px;
}
</style>