import Collaborator from "../models/Collaborator.js"
import Project from "../models/Project.js"
import User from "../models/User.js"

export const AllUsers = async (req,res)=>{
  try {
    const findInDb = await User.find({})
    return res.status(200).json(findInDb)
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    const findUserDb = await User.findById(id)
    res.status(200).json(findUserDb)
  } catch (err) {
    res.status(400).json(err.message)
  }
}

export const userProjects = async (req, res)=>{
    let { id } = req.body
    let getMyProjects = await User.findById(id)
    if (getMyProjects.projects.length){
        let projets = getMyProjects.projects.map(async m => await Project.findById(m))
        const resPromises = await Promise.all(projets)
        return res.json(resPromises)
      } else {
        return res.status(404).send("you don't have any project")
      }
}

export const userCollaborations = async (req,res)=>{
  let {idProject, idUserCollaborator, linkedin, number, text, email} = req.body 
  const message = "you must complete the required fields"
  // if(!idProject && !idUser && !linkedin && !number && !text && !email) res.status(400).json({message})
  // const regExpLiteral = /http(s)?:\/\/([\w]+\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?/gim
  // console.log(linkedin.match(regExpLiteral))
try {
  let project = await Project.findById(idProject)
  console.log(project)
  ///////////////////////
  // let collabsProject = project.collaborators.map(async m => await Collaborator.findById(m))
  // let respromise = await Promise.all(collabsProject)
  ////////////////////////
  // FALTA MAPEAR LOS USUARIOS QUE YA ESTAN COLABORANDO PARA QUE NO DUPLIQUE
  let findUsers = project.collaborators.filter((element) => element.idUser.toString() === idUserCollaborator)
  console.log('FIND USERS:', findUsers)
  if(findUsers.length > 0) {
    throw new Error('you have already joined this project')
  } else {
    console.log('ID project:', idProject)
    // console.log('OBJECT ID USER:', ObjectId(idUserCollaborator) )
    // await Project.findByIdAndUpdate(saveProject._id.toString(), { $push: { 'collaborators': { idUser: ObjectId('632a4c68e031e22d1153fa90'), status: 'pending'} } })

    await Project.findByIdAndUpdate(project._id.toString(), { $push: { 'collaborators': { idUser: ObjectId("6329b632f0863f343bcc21b8"), status: 'pending' } } })
    
    return res.status(200).json({message:'collaboration sent successfully'})
  }
  

  // let findUsers = respromise.map(async m => await User.findById(m.idUser))
  // let resUserpromises = await Promise.all(findUsers)
  // let conditioncollab = resUserpromises.filter(f=> f._id==idUser)

  // if(conditioncollab.length) throw new Error('you have already joined this project')

  // let user = await User.findById(idUser)

  // if(project && user){
  //   let newCollaborator = await Collaborator.create({idUser, linkedin, number, text, email})
  //   let mycollaborations= await User.findByIdAndUpdate(idUser,{ $push: { 'collaborations': idProject } })
  //   await mycollaborations.save()
  //   let pendingcolaborators = await Project.findByIdAndUpdate(idProject,{ $push: { 'collaborators': newCollaborator._id } })
  //   await pendingcolaborators.save()
  //   return res.status(200).json({message:'collaboration sent successfully'})
  // }
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

export const MyCollaborations = async (req,res)=>{
  let {id} = req.body
  let getMyColaborations = await User.findById(id)
  if (getMyColaborations.collaborations.length){
    let projets = getMyColaborations.collaborations.map(async m => await Project.findById(m))
    const resPromises = await Promise.all(projets)
    return res.json(resPromises)
  } else {
    return res.status(404).send("you don't have any collaboration")
  }
}
