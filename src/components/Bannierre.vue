<template>
   <div class="container">
    <div class="row">
        <div class="col-md-4">
            <div class="mb-3">
                <select name="" id="" class="form-control" v-model="BanCate">
                    <option value="" disabled >Selectionner La Categorie</option>
                    <option v-for="cate in AllCate" :value="cate.id"> {{ cate.category_name }} </option>
                </select>
            </div>
        </div>
        <div class="col-md-4">
            <div class="mb-3">
                <input type="file" name="" @change="saveImg" id="" class="form-control" accept="image/*">
            </div>
        </div>
    </div>
    <button class="btn btn-primary" @click="SaveBan()">Enregistrer</button>
   </div>
  </template>

  <script>
import { collection, doc, getDocs, getFirestore, setDoc, Timestamp } from '@firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@firebase/storage';
import { defineComponent } from 'vue';
import app from '../../fi';

   export default defineComponent ({
     name:'BanNiere',
     data(){
        return{
            BanCate:'',
            BanPicture:'',
            AllCate:[]
        }
     },
    async created(){
    const db = getFirestore(app)
     const AllCate1 = await getDocs(collection(db,'CATEGORIES'))
     AllCate1.forEach((element)=>{
      this.AllCate.push(element.data())
     })
     },
     methods:{
      async  saveImg(event){
         const storage = getStorage(app)
         const refImg = ref(storage,`Bannieres/${event.target.files[0].name}`)
        const snapsot = await uploadBytes(refImg,event.target.files[0])
        this.BanPicture = await getDownloadURL(snapsot.ref)
        alert('enregistrer')
        },
        SaveBan(){
            if(this.BanCate !='' && this.BanPicture != '') {
                const db = getFirestore(app)
            const refBan = doc(collection(db,'BANNIERE'))
            setDoc(refBan,{
                id:refBan.id,
                category_id:this.BanCate,
                slider_image:this.BanPicture,
                time:Timestamp.now()
            })
            alert('enregistrer')
            }
           
        }
     }

   })
</script>
  <style scoped>
  
  </style>