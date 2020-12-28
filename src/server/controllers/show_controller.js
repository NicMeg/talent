const { 
  companyById 
} = require('../utils/company_utils')
const {
  createShow,
  showById,
  showsByUser,
  showsByCompany,
  deleteShow
} = require('../utils/show_utils')
const { 
  venueById 
} = require('../utils/venue_utils')

const createNewShow = (req,res) => {
  try {    
    companyById(req.body.company).exec( async (err, company) => {
      if(!company){
        res.status(500)
        return res.json("No company found")
      }

      const show = await createShow(req)
      company.shows.push(show._id)
      company.save((err, company) => {

        if (show.venue) {
          venueById(show.venue).exec((err, venue) => {
            venue.shows.push(show._id) 
            venue.save((err, venue) => {
              res.json({
                show: show,
                company: company,
                venue: venue
              })
            })
          })
        } else {
          res.json({
            show: show,
            company: company,
          })
        }
      })
    })

  } catch (err) {
    res.status(500)
    res.json(err)
  }  
}

const editShowById = (req, res) => {
  showById(req.params.id).exec((err,show) => {

    if(err) {
      res.status(500)
      res.json(err)
    }

    for (const [key, value] of Object.entries(req.body)) {
      show[key] = value
    }

    show.save((err, show) => {
      if(err) {
        res.status(500)
        res.json(err)
      }

      res.json(show)

    })
  })
}

const getShowById = (req, res) => {
  try {
    showById(req.params.id).exec((err, show) => {
      if(!show){
        res.status(500)
        return res.json("No show found")
      }
  
      res.json({
        show: show
      })
    })
  } catch (err) {
    res.status(500)
    res.json(err)
  }
}

const getShowsByUser = (req,res) => {
  if (req.user.is_artist) {
    showsByUser(req.user._id).exec((err,shows) => {
      if (err) {
        res.status(500)
        res.json(err)
      }

      res.json(shows)
    })
  } else {
    showsByUser(req.params.id).exec((err,shows) => {
      if (err) {
        res.status(500)
        res.json(err)
      }

      res.json(shows)
    })
  }
}

const getShowsByCompany = (req, res) => {
  if(req.user.is_artist) {
    res.status(401)
  }

  showsByCompany(req.params.id).exec((err,shows) => {
    if (err) {
      res.status(500)
      res.json(err)
    }
    console.log(shows)
    res.json(shows)
  })
}

const destroyShowById = (req, res) => {
  try {
    deleteShow(req.params.id).exec((err) => {
      res.json('Show deleted')
    })
  } catch (err) {
    res.status(500)
    res.json(err)
  }
}

module.exports = {
  createNewShow,
  editShowById,
  getShowById,
  getShowsByUser,
  getShowsByCompany,
  destroyShowById
}