package server

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/tt-trichter/app/api/internal/database"
)

type RunDco struct {
	Duration float32 `json:"duration" binding:"required,gt=0"`
	Rate     float32 `json:"rate" binding:"required,gt=0"`
	Volume   float32 `json:"volume" binding:"required,gt=0"`
	UserId   string  `json:"userId"`
	Image    *string `json:"image"`
}

type RunData struct {
	Duration float32 `json:"duration"`
	Rate     float32 `json:"rate"`
	Volume   float32 `json:"volume"`
}

type RunDao struct {
	ID        string    `json:"id"`
	Data      RunData   `json:"data"`
	Image     *string   `json:"image"`
	CreatedAt time.Time `json:"createdAt"`
	User      UserInfo  `json:"user"`
}

type RunMessage struct {
	ID string `json:"id"`
}

func (s *Server) getRunsWithUsersHandler(c *gin.Context) {
	runs, err := s.db.Queries().GetAllRunsWithUsers(c.Request.Context())
	if err != nil {
		log.Printf("Error getting runs with users: %v", err)
		c.JSON(http.StatusInternalServerError, APIResponse{
			Success: false,
			Error:   "Failed to fetch runs",
		})
		return
	}

	response := make([]RunDao, 0, len(runs))
	for _, r := range runs {
		var data RunData
		if err := json.Unmarshal(r.Data, &data); err != nil {
			log.Printf("Error unmarshaling run data: %v", err)
			continue
		}

		user := UserInfo{
			ID:       *r.UserId,
			Name:     *r.UserName,
			Username: *r.UserUsername,
		}

		response = append(response, RunDao{
			ID:        r.ID.String(),
			Data:      data,
			Image:     r.Image,
			CreatedAt: r.CreatedAt.Time,
			User:      user,
		})
	}

	c.JSON(http.StatusOK, response)
}

func (s *Server) createRunHandler(c *gin.Context) {
	var dco RunDco
	if err := c.ShouldBindJSON(&dco); err != nil {
		c.JSON(http.StatusBadRequest, APIResponse{
			Success: false,
			Error:   "Validation failed",
			Details: err.Error(),
		})
		return
	}

	data, err := json.Marshal(RunData{
		Rate:     dco.Rate,
		Volume:   dco.Volume,
		Duration: dco.Duration,
	})
	if err != nil {
		log.Printf("Error marshaling run data: %v", err)
		c.JSON(http.StatusInternalServerError, APIResponse{
			Success: false,
			Error:   "Internal server error",
		})
		return
	}

	savedRun, err := s.db.Queries().SaveRun(c.Request.Context(), database.SaveRunParams{
		UserId: dco.UserId,
		Data:   data,
		Image:  dco.Image,
	})
	if err != nil {
		log.Printf("Error saving run: %v", err)
		c.JSON(http.StatusInternalServerError, APIResponse{
			Success: false,
			Error:   "Failed to save run",
		})
		return
	}

	log.Printf("Created new run: %s", savedRun.ID.String())
	s.Notify(RunCreatedEvent, RunMessage{ID: savedRun.ID.String()})
	c.JSON(http.StatusOK, APIResponse{Success: true})
}

func (s *Server) deleteRunHandler(c *gin.Context) {
	runId := c.Param("id")
	var runUuid pgtype.UUID
	if err := runUuid.Scan(runId); err != nil {
		c.JSON(http.StatusBadRequest, APIResponse{
			Success: false,
			Error:   "Invalid run ID format",
		})
		return
	}

	err := s.db.Queries().DeleteRun(c.Request.Context(), runUuid)
	if err != nil {
		log.Printf("Error deleting run: %v", err)
		c.JSON(http.StatusInternalServerError, APIResponse{
			Success: false,
			Error:   "Failed to delete run",
		})
		return
	}

	log.Printf("Deleted run: %s", runId)
	s.Notify(RunDeletedEvent, RunMessage{ID: runId})
	c.JSON(http.StatusOK, APIResponse{Success: true})
}

func parseUUID(s string) (uuid.UUID, error) {
	return uuid.Parse(s)
}
