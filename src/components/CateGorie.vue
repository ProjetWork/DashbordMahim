<template>
     <div class="container" >
      <div class="row">
        <div class="col-md-4">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Le nom de la categorie</label>
                <input type="text" v-model ="CateName" class="form-control" id="exampleFormControlInput1" placeholder="le nom de la categorie">
              </div>
        </div>
        <div class="col-md-4">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Le nom des sous Categories </label>
                <input type="text" v-model ="SousCate" class="form-control" id="exampleFormControlInput1" placeholder="le nom des Sous Categorie avec virgule">
              </div>
        </div>
        <div class="col-md-4">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">La Photo de la categorie</label>
                <input type="file" class="form-control" id="exampleFormControlInput1" @change="SaveFile" accept="image/*">
              </div>
        </div>
      </div>
      <button class="btn btn-primary" @click="SaveCate()">Enregistrer</button>
    </div>
</template>
<script>
import { defineComponent } from 'vue';
import app from '../../fi';
import {getFirestore,setDoc,doc,collection,} from 'firebase/firestore'
import {getStorage,ref,uploadBytes,getDownloadURL} from 'firebase/storage'
export default defineComponent ({
    name:'CateGorie',
    data(){
        return{
        CateLinkPhoto:undefined,
        CateId:'',
        CateName:'',
        SousCate:'',
        AllCate:[],
        }
    },
  
    methods:{
        SaveFile(event){
          if(!event.target.files[0]){
                return
            }
       try {
         const storage = getStorage(app)
       const refStorage = ref(storage, `categories/${event.target.files[0].name}`)
       uploadBytes(refStorage,event.target.files[0]).then(async(snapshot)=>{
         this.CateLinkPhoto =  await getDownloadURL(snapshot.ref)
         alert('photo enregistre')
       })
       } catch (error) {
         alert('erreur')
       }
      
     },
     SaveCate(){
        try {
          if(this.CateLinkPhoto && this.CateName != '' && this.SousCate !=''){
            let takeSoutCate = this.SousCate.split(',')
         const db = getFirestore(app)
         const refCate = doc(collection(db,'CATEGORIES'))
         setDoc(refCate,{
          id:refCate.id,
          category_name:this.CateName,
          category_thumb_image:this.CateLinkPhoto,
          products:[],
          SousCate:takeSoutCate
         })
         alert('ajouter avec succes')
         this.CateName=''
         this.SousCate=''
       }
        } catch (error) {
          alert('erreur')
        }
      
      },
    }
})
</script>