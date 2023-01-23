<template>
    <div class="container" >
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
                <select name="" id="" class="form-control" v-model="getSousCate">
           <option value="" disabled> selectionner la sous categories</option>
            <option  v-for="SousCat in SousCate.SousCate" :value="SousCat"> {{ SousCat }}  </option>
          </select>
              </div>
            </div>
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
</template>
<script>
import { defineComponent } from 'vue';
import app from '../../fi';
import {getStorage,ref,uploadBytes,getDownloadURL} from 'firebase/storage'
import {getFirestore,setDoc,doc,collection,getDocs, updateDoc, arrayUnion, Timestamp} from 'firebase/firestore'
export default defineComponent ({
    name:'ProDuct',
    data(){
        return{
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
        AllCate:[],
        getSousCate:'',
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
    computed:{
       SousCate(){
         if (this.PCate) {
           return this.AllCate.find(e=>e.id == this.PCate)
         }else{
            return {SousCate:[]}
         }
       }
    },
    methods:{
        savePfile(event){
            if(!event.target.files[0]){
                return
            }
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
       if (this.Pname != '' && this.PCate !='' && this.Pprice !='' && this.PpromoPrice !='' && this.PFour!='' && this.stock !='' && this.PphotoCate != ''  && this.Pphoto.length !=0 && this.getSousCate !='') {
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
        time:Timestamp.now(),
        SousCate:this.getSousCate
        
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
        time:Timestamp.now(),
        SousCate:this.getSousCate
        })
      })
      alert('enregistrer')
      this.Pname=''
      this.Pprice=''
      this.PpromoPrice=''
      this.stock=''
       }else{
        alert('remplisser le formulaire')
       }
      
    },
    }
})
</script>