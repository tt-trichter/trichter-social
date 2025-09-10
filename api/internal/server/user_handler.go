package server

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/tt-trichter/app/api/internal/database"
)

type UserInfo struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Username string `json:"username"`
}

func (s *Server) searchUsersHandler(c *gin.Context) {
	name := c.Query("name")
	limitStr := c.DefaultQuery("limit", "10")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, APIResponse{
			Success: false,
			Error:   "Invalid limit parameter",
		})
		return
	}

	users, err := s.db.Queries().SearchUsersByName(c.Request.Context(), database.SearchUsersByNameParams{
		Column1: &name,
		Limit:   int32(limit),
	})
	if err != nil {
		log.Printf("Error searching users: %v", err)
		c.JSON(http.StatusInternalServerError, APIResponse{
			Success: false,
			Error:   "Failed to search users",
		})
		return
	}

	var response []map[string]interface{}
	for _, user := range users {
		response = append(response, map[string]interface{}{
			"id":              user.ID,
			"name":            user.Name,
			"username":        user.Username,
			"displayUsername": user.DisplayUsername,
		})
	}

	c.JSON(http.StatusOK, response)
}
