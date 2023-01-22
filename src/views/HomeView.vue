<script>
import {defineComponent} from 'vue'
import {getFirestore,setDoc,doc,collection,getDocs, updateDoc, arrayUnion} from 'firebase/firestore'
import {getStorage,ref,uploadBytes,getDownloadURL} from 'firebase/storage'
import Bannierre from '../components/Bannierre.vue'
import app from '../../fi'
  export default defineComponent ({
    name:'HomeView',
    components:{Bannierre},
    data(){
      return {
        active:'home',
        type:'categorie',
        CateLinkPhoto:undefined,
        CateId:'',
        CateName:'',
        AllCate:[],
        //les variables du produits 
        Pname:'',
        PCate:'',
        Pprice:'',
        PpromoPrice:'',
        PFour:'',
        stock:'',
        Desc:'',
        PphotoCate:'',
        Pphoto:[],
        sku_code:'',
        //les variables pour fournisseur
        FourName:'',
        FourLink:'',
        AllFour:[]

      }
    },
    async created(){
      const db = getFirestore(app)
      const refAllCate = await getDocs(collection(db,'CATEGORIES'))
      refAllCate.forEach((element)=>{
        this.AllCate.push(element.data())
      })
      //prendre tout les fournisseurs 
      const refAllFour = await getDocs(collection(db,'FOURNISSEURS'))
      refAllFour.forEach((element)=>{
        this.AllFour.push(element.data())
      })


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
      SaveFile(event){
       
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
          if(this.CateLinkPhoto && this.CateName != ''){
         const db = getFirestore(app)
         const refCate = doc(collection(db,'CATEGORIES'))
         setDoc(refCate,{
          id:refCate.id,
          category_name:this.CateName,
          category_thumb_image:this.CateLinkPhoto,
          products:[]
         })
         alert('ajouter avec succes')
       }
        } catch (error) {
          alert('erreur')
        }
      
      },
   
    //les fonctions pour l'ajout des produits
    savePfile(event){
      let take = Array.from(event.target.files)
      const storage = getStorage(app)
      let i = 1
      take.forEach(async(file)=>{
       const refP = ref(storage, `Produits/${file.name}`)
          const snapshot = await uploadBytes(refP,file)
          const link = await getDownloadURL(snapshot.ref)
          if(this.PphotoCate ==''){
            this.PphotoCate=link
          } 
          this.Pphoto.push(link)
         
          if(i==take.length){
            alert('enregistrer')
            console.log('oui')
            console.log(this.PphotoCate)
          } 
          i=i+1
     })
     
    },
    SaveProduct(){
       if (this.Pname != '' && this.PCate !='' && this.Pprice !='' && this.PpromoPrice !='' && this.PFour!='' && this.stock !='' && this.PphotoCate != '' && this.Desc !='' && this.Pphoto.length !=0) {
        this.PpromoPrice = parseInt(this.PpromoPrice)
      this.Pprice=parseInt(this.Pprice)
      this.stock=parseInt(this.stock)
      let takeName = this.AllFour.find(e=>e.id == this.PFour)
      const db = getFirestore(app)
      const refProduct = doc(collection(db,'PRODUITS'))
      setDoc(refProduct,{
        id:refProduct.id,
        product_images:this.Pphoto,
        product_thumb_image:this.PphotoCate,
        product_name:this.Pname,
        product_highlights:this.Desc,
        regular_price:this.PpromoPrice,
        sales_price:this.Pprice,
        stock:this.stock,
        sku_code:'',
        FourName:takeName.FourName,
        CateId:this.PCate,
        PFour:this.PFour,
        
      })
      updateDoc(doc(db,'CATEGORIES',this.PCate),{
        products:arrayUnion({
          id:refProduct.id,
        product_images:this.Pphoto,
        product_thumb_image:this.PphotoCate,
        product_name:this.Pname,
        product_highlights:this.Desc,
        regular_price:this.PpromoPrice,
        sales_price:this.Pprice,
        stock:this.stock,
        sku_code:'',
        FourName:takeName.FourName,
        CateId:this.PCate,
        PFour:this.PFour,
        })
      })
      alert('enregistrer')
       }else{
        alert('remplisser le formulaire')
       }
      
    },
    //les fonction pour l'ajout des fournisseur
   async saveFourLink(event){

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
    <div class="container" v-if="type=='categorie'">
      <div class="row">
        <div class="col-md-6">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Le nom de la categorie</label>
                <input type="text" v-model ="CateName" class="form-control" id="exampleFormControlInput1" placeholder="le nom de la categorie">
              </div>
        </div>
        <div class="col-md-6">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">La Photo de la categorie</label>
                <input type="file" class="form-control" id="exampleFormControlInput1" @change="SaveFile" accept="image/*">
              </div>
        </div>
      </div>
      <button class="btn btn-primary" @click="SaveCate()">Enregistrer</button>
    </div>

    <!--pour l'ajout des produits-->
    <div class="container" v-if="type=='produit'">

      <div class="row">
    <div class="col-md-4">
      <div class="mb-3">
        <input type="text" v-model="Pname" class="form-control" id="exampleFormControlInput1" placeholder="nom du produits">
      </div>
    </div>
    <div class="col-md-4">
      <div class="mb-3">
        <input type="number" v-model="PpromoPrice" class="form-control" id="exampleFormControlInput1" placeholder="Prix Promo">
      </div>
    </div>
    <div class="col-md-4">
      <div class="mb-3">
        <input type="number" v-model="Pprice" class="form-control" id="exampleFormControlInput1" placeholder="Prix reel">
      </div>
    </div>
      </div>
     
      <div class="row">
        <div class="col-md-4">
          <div class="mb-3">
            <input type="number" v-model="stock" class="form-control" id="exampleFormControlInput1" placeholder="nombre de Stock">
          </div>
        </div>
        <div class="col-md-4">
          <div class="mb-3">
            <input type="file" @change="savePfile"  class="form-control" id="exampleFormControlInput1" placeholder="image du produit" multiple accept="image/*">
          </div>
        </div>
        <div class="col-md-4">
          <div class="mb-3">
            <input type="text" v-model="Desc" class="form-control" id="exampleFormControlInput1" placeholder="Description">
          </div>
        </div>
          </div>
          <div class="row">
            <div class="col-md-4">
          <div class="mb-3">
          <select name="" id="" class="form-control" v-model="PCate" >
           <option value="" disabled> selectionner la categorie</option>
            <option  v-for="cate in AllCate" :key="cate.id" :value="cate.id"> {{ cate.category_name }} </option>
          </select>
          </div>
        </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="mb-3">
                <select name="" id="" class="form-control" v-model="PFour" >
           <option value="" disabled> selectionner le fournisseur</option>
            <option  v-for="four in AllFour" :value="four.id">  {{ four.FourName }} </option>
          </select>
              </div>
            </div>
            
          </div>
       <button class="btn btn-primary" @click="SaveProduct()"> Enregistrer</button>
    </div>
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