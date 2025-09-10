package server

import (
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://trichter.hauptspeicher.com"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	r.GET("/health", s.healthHandler)

	v2 := r.Group("/api/v2")
	{
		v2.GET("/ws", s.wsHandler)

		runs := v2.Group("/runs")
		{
			runs.GET("", s.getRunsWithUsersHandler)
			runs.POST("", s.createRunHandler)
			runs.DELETE("/:id", s.deleteRunHandler)
		}

		v2.POST("/images", s.uploadImageHandler)

		v2.GET("/users/search", s.searchUsersHandler)
	}

	r.GET("/metrics", s.metricsHandler)

	return r
}

func (s *Server) healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, s.db.Health())
}

func requireBasicAuth() gin.HandlerFunc {
	return gin.BasicAuth(gin.Accounts{
		os.Getenv("BASIC_AUTH_USERNAME"): os.Getenv("BASIC_AUTH_PASSWORD"),
	})
}
